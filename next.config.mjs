/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Роботы и браузеры часто запрашивают /favicon.ico; без файла был 404.
      { source: "/favicon.ico", destination: "/icon" },
    ];
  },
};

export default nextConfig;
