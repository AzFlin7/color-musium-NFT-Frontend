const CompressionPlugin = require("compression-webpack-plugin");

const REDIRECT = "/rugfools";

module.exports = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  future: { webpack5: true },
  webpack(config) {
    config.plugins.push(
      new CompressionPlugin({
        test: /\.js$|\.css$|\.html$/,
      })
    );
    return config;
  },
  async redirects() {
    return [
      {
        source: "/gallery",
        destination: "/gallery/color-nft",
        permanent: false,
      },
      {
        source: "/brave1",
        destination: REDIRECT,
        permanent: false,
      },
      {
        source: "/brave2",
        destination: REDIRECT,
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|png)",
        locale: false,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=9999999999, must-revalidate",
          },
        ],
      },
    ];
  },
  images: {
    domains: ['imagedelivery.net'],
  },
};
