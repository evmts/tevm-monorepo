// Api keys
const env = {
  ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
  ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
  ARBISCAN_API_KEY: process.env.ARBISCAN_API_KEY,
  BASESCAN_API_KEY: process.env.BASESCAN_API_KEY,
  OPTIMISTIC_ETHERSCAN_API_KEY: process.env.OPTIMISTIC_ETHERSCAN_API_KEY,
  POLYGONSCAN_API_KEY: process.env.POLYGONSCAN_API_KEY,
};

Object.keys(env).forEach((key) => {
  if (!env[key]) {
    console.warn(
      `No ${key} environment variable set. You may face throttling.`,
    );
  }
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Temporary hack to fix the top-level await issue in ethereumjs
  webpack: (config, { webpack }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'stream/web': 'web-streams-polyfill',
    };
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, '');
      }),
    );

    return config;
  },
  // These will get exposed to the browser
  // If you would like to keep this key private, use an API route/server components to
  // access it and return the data instead
  env,
};

export default nextConfig;
