const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "prod-files-secure.s3.us-west-2.amazonaws.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "www.notion.so" },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.devtool = "source-map"; // Ensures source maps are generated for client-side code
    }

    // Add JSON loader
    config.module.rules.push({
      test: /\.json$/,
      loader: "json-loader",
    });

    return config;
  },
};

const sentryWebpackPluginOptions = {
  org: "personal-use-mn",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  automaticVercelMonitors: true,
};

// Correctly apply Sentry to the Next.js config
module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
