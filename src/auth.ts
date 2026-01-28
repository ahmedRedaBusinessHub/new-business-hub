import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { LoginDto, LoginResponse, LoginSuccessResponse, Login2FAResponse, UserRole } from "./types/auth";
import { apiGet, apiPost } from "./lib/api";

// Helper: get user info from access token or /auth/me
async function getUserFromToken(accessToken: string, identifier: string) {
  try {
    const meRes = await apiGet("/auth/me", { accessToken });
    if (meRes.ok) {
      const userData = await meRes.json();
      const user = userData.data || userData.user || userData;
      const role = user.role?.toString?.()?.toLowerCase?.() || "client";
      return {
        id: user.id?.toString() || user.userId?.toString() || identifier,
        name: user.name || user.firstName || user.username || identifier,
        email: user.email || identifier,
        role: role as UserRole,
        accessToken,
      };
    }
  } catch (e) {
    console.warn("Failed /auth/me, fallback to JWT decode:", e);
  }

  // Fallback: decode JWT
  const tokenParts = accessToken.split(".");
  let userInfo: any = { id: identifier, name: identifier, email: identifier, role: "client" };
  if (tokenParts.length === 3) {
    try {
      const payload = JSON.parse(Buffer.from(tokenParts[1], "base64").toString());
      userInfo = {
        id: payload.sub?.toString() || payload.id?.toString() || identifier,
        name: payload.name || payload.username || identifier,
        email: payload.email || identifier,
        role: payload.role || payload.roles?.[0] || "client",
      };
    } catch (e) {
      console.warn("Failed JWT decode:", e);
    }
  }
  return { ...userInfo, accessToken };
}

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const creds = credentials as unknown as LoginDto & { access_token?: string };
          const {
            identifier,
            password,
            access_token, // For OTP verification flow
            country_code,
            platform,
            client_info,
            firebase_token,
          } = creds;

          // If access_token is provided (from OTP verification), use it directly
          if (access_token) {
            return await getUserFromToken(access_token, identifier);
          }

          if (!identifier || !password) {
            throw new Error("Identifier and password are required");
          }

          // Prepare request body matching NestJS LoginDto
          const requestBody: LoginDto = {
            identifier,
            password,
          };

          // Add optional fields if provided
          if (country_code) {
            requestBody.country_code = country_code;
          }
          if (platform) {
            requestBody.platform = platform;
          }
          if (client_info) {
            requestBody.client_info = client_info;
          }
          if (firebase_token) {
            requestBody.firebase_token = firebase_token;
          }

          const res = await apiPost("/auth/login", requestBody, {
            requireAuth: false,
          });

          // Parse response JSON safely
          let data: LoginResponse | any = {};
          try {
            const text = await res.text();
            if (text) {
              data = JSON.parse(text);
            }
          } catch (parseError) {
            console.error("Failed to parse API response:", parseError);
            // If response is not JSON, try to extract error message from status
            if (!res.ok) {
              throw new Error(
                res.status === 401
                  ? "Invalid email or password"
                  : res.status === 400
                  ? "Validation error"
                  : "Authentication failed"
              );
            }
            throw new Error("Invalid response from server");
          }

          // Check if response is successful (200 or 201)
          const isSuccess = res.status === 200 || res.status === 201;

          // Handle 2FA scenarios - check if response has 'actions' field (2FA enabled)
          // Backend returns: { message: string, actions: string, retry_after?: Date }
          // where actions is: 'sent_email' | 'sent_sms' | 'already_sent_email' | 'already_sent_sms'
          if (isSuccess && "actions" in data && !("access_token" in data)) {
            const twoFAResponse = data as Login2FAResponse;
            // 2FA is enabled - OTP sent or already sent
            // Create a custom error with the 2FA data in both message and cause
            const twoFAData = JSON.stringify({
              type: "2FA_REQUIRED",
              message: twoFAResponse.message,
              actions: twoFAResponse.actions,
              retry_after: twoFAResponse.retry_after,
              identifier,
              country_code,
            });
            
            const error = new Error(twoFAData);
            // Set cause to the same JSON string so it's accessible even if NextAuth wraps the error
            (error as any).cause = twoFAData;
            // Add a custom property for easier access
            (error as any).twoFAData = twoFAData;
            throw error;
          }

          // Handle successful login (2FA disabled) - status 200 or 201 with access_token
          if (isSuccess && "access_token" in data) {
            const successResponse = data as LoginSuccessResponse;
            return await getUserFromToken(successResponse.access_token, identifier);
          }

          // Handle error responses
          if (res.status === 401) {
            const errorMsg = Array.isArray((data as any).message)
              ? (data as any).message.join(", ")
              : (typeof (data as any).message === "string" ? (data as any).message : "Invalid email or password");

            // NextAuth v5 converts errors to "Configuration" when it can't serialize them properly
            // To preserve Arabic text, we encode it in the error message as JSON
            // The frontend will decode it
            const encodedError = JSON.stringify({ type: "AUTH_ERROR", message: errorMsg });
            const error = new Error(encodedError);
            (error as any).cause = errorMsg; // Also set cause for NextAuth's internal logging
            
            throw error;
          }

          if (res.status === 400) {
            const errorMessage =
              typeof (data as any).message === "string"
                ? (data as any).message
                : Array.isArray((data as any).message)
                ? (data as any).message.join(", ")
                : "Validation error";
            const error = new Error(errorMessage);
            (error as any).cause = errorMessage;
            throw error;
          }

          // Handle other error status codes
          if (!isSuccess) {
            const errorMsg = Array.isArray((data as any).message)
              ? (data as any).message.join(", ")
              : (typeof (data as any).message === "string" ? (data as any).message : "Authentication failed");
            const error = new Error(errorMsg);
            (error as any).cause = errorMsg;
            throw error;
          }

          // If we reach here without success, throw generic error
          throw new Error("Authentication failed");
        } catch (error: any) {
          console.error("Authorization error:", error);
          
          // Re-throw 2FA errors so they can be handled by frontend
          // Check both message and cause for 2FA_REQUIRED
          const errorMessage = error?.message || error?.cause || "";
          if (errorMessage.includes("2FA_REQUIRED") || error?.twoFAData) {
            // Ensure the error has the 2FA data accessible
            if (!error.cause && error.twoFAData) {
              error.cause = error.twoFAData;
            }
            throw error;
          }
          
          // Re-throw errors to preserve the message
          // NextAuth will wrap it but the message should be accessible via res.error
          throw error;
        }
      },
    }),
  ],

  // Merge callbacks - properly combine authConfig callbacks with our custom ones
  callbacks: {
    // JWT callback - merge with authConfig if it exists
    async jwt({ token, user, trigger, session, ...params }: any) {
      // Call authConfig jwt callback first if it exists
      if (authConfig.callbacks?.jwt) {
        const authConfigToken = await authConfig.callbacks.jwt({ token, user, trigger, session, ...params });
        token = authConfigToken || token;
      }

      // Our custom JWT logic
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
      }

      // Handle session updates
      if (trigger === "update" && session) {
        if (session.accessToken) {
          token.accessToken = session.accessToken;
        }
        if (session.user?.role) {
          token.role = session.user.role;
        }
      }

      return token;
    },

    // Session callback - merge with authConfig if it exists
    async session({ session, token, ...params }: any) {
      // Call authConfig session callback first if it exists
      if (authConfig.callbacks?.session) {
        const authConfigSession = await authConfig.callbacks.session({ session, token, ...params });
        session = authConfigSession || session;
      }

      // Our custom session logic
      if (token) {
        session.accessToken = token.accessToken as string | undefined;
        if (token.id) {
          session.user.id = token.id as string;
        }
        if (token.role) {
          session.user.role = token.role as UserRole;
        }
        if (token.email) {
          session.user.email = token.email as string;
        }
        if (token.name) {
          session.user.name = token.name as string;
        }
      }

      return session;
    },

    // Authorized callback from authConfig
    authorized: authConfig.callbacks?.authorized,
  },

  // Error handling
  events: {
    async signIn({ user }: any) {
      console.log("user",user);
      // Log successful sign-ins
      console.log("User signed in:", user?.email || user?.id);
    },
    async signOut({ token }: any) {
      // Call backend logout endpoint to invalidate token
      if (token?.accessToken) {
        try {
          await apiPost(
            "/auth/logout",
            {},
            {
              accessToken: token.accessToken as string,
              requireAuth: true,
            }
          );
        } catch (error) {
          console.warn("Failed to call logout endpoint:", error);
          // Don't throw - allow sign out to complete even if backend call fails
        }
      }
    },
  },

  // Session configuration
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
});