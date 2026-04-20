const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        // destination: "http://localhost:3005/api/:path*", 
        // hoặc dev tunnel nếu bạn cần:
        destination: `${process.env.NEXT_PUBLIC_API_URL_BACKEND}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;