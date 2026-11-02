/** @type {import('next').NextConfig} */
const proxyTarget = process.env.API_PROXY_TARGET?.replace(/\/+$/, "");

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
   * domain. On Vercel, set API_PROXY_TARGET to the deployed API origin (for
   * example https://studiospace-backend.vercel.app) and redeploy: rewrites are
   * generated at build time.
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
