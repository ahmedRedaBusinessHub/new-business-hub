import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        return {
          ...{
            id: 125,
            name: "ahmed reda ahmed",
            email: "ahmedreda@gmail.com",
            role: "admin",
          },
          accessToken: "data.accessToken",
        };
        try {
          const res = await fetch(process.env.EXTERNAL_API_URL!, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            console.error("Failed to authenticate with external API");
            return null;
          }

          const data = await res.json();

          if (data && data.user) {
            return {
              ...data.user,
              accessToken: data.accessToken,
            };
          }

          return null;
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
});
