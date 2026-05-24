/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      "@prisma/client",
      "pg",
      "@prisma/adapter-pg",
    ],
    outputFileTracingIncludes: {
      "/*": [
        "./node_modules/.prisma/client/**/*",
        "./node_modules/@prisma/client/**/*",
      ],
    },
  },
};

export default nextConfig;
