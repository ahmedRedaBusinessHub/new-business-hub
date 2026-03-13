import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  devIndicators: {
    position: "bottom-right",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https", // or 'http' if applicable
        hostname: "**", // This wildcard allows images from any hostname
        port: "", // Leave empty unless a specific port is required
        pathname: "/**", // This wildcard allows any path on the hostname
      },
    ],
  },
  // cacheComponents: true, //A new programming model leveraging Partial Pre-Rendering (PPR) and use cache for instant navigation.
  // turbopackFileSystemCacheForDev: true, //Even faster startup and compile times
  // reactCompiler: true, //Built-in integration for automatic memoization
  // browserDebugInfoInTerminal: true, //The experimental.browserDebugInfoInTerminal option forwards console output and runtime errors originating in the browser to the dev server terminal.
  // experimental: {
  //   browserDebugInfoInTerminal: {
  //     depthLimit: 5,
  //     edgeLimit: 100,
  //   },
  // },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
