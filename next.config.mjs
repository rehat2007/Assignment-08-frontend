/** @type {import('next').NextConfig} */
// Deployed Express API (Vercel project "assignment-08-backend"). Used as the
// production default so the frontend works without extra dashboard config;
// set API_PROXY_TARGET in Vercel to override it.
const DEPLOYED_API = "https://assignment-08-backend-pi.vercel.app";

const proxyTarget = (
  process.env.API_PROXY_TARGET ||
  (process.env.NODE_ENV === "production" ? DEPLOYED_API : "")
).replace(/\/+$/, "");

const nextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  /**
   * Proxy browser API calls through this deployment so the Better Auth cookie
   * is always sent, even when the API lives on a different `*.vercel.app`
   * domain. Set API_PROXY_TARGET on Vercel to point at another API origin and
   * redeploy: rewrites are generated at build time.
   */
  async rewrites() {
    if (!proxyTarget) return [];
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${proxyTarget}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
