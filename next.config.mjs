/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Динамический import("proxifly") не попадает в standalone-трейс без явного списка.
  experimental: {
    outputFileTracingIncludes: {
      "/api/contact": [
        "./node_modules/proxifly/**/*",
        "./node_modules/wonderful-fetch/**/*",
        "./node_modules/itwcw-package-analytics/**/*",
        "./node_modules/fs-jetpack/**/*",
        "./node_modules/mime-types/**/*",
        "./node_modules/mime-db/**/*",
      ],
    },
  },
};

export default nextConfig;
