const { webpackPluginEvmts } = require('@evmts/webpack');
/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false }
    return config
  },
  plugins: [
    webpackPluginEvmts({
      project: '.',
      out: 'artifacts'
    }
    ),
  ],
}

