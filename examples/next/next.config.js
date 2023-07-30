const { webpackPluginEvmts } = require('@evmts/webpack-plugin')

/** @type {import('next').NextConfig} */
module.exports = {
	typescript: {
		// Typechecking will only be available after the LSP is migrated to volar
		// Until then typechecking will work in editor but not during a next.js build
		// If you absolutely need typechecking before then there is a way to generate .ts files via a ts-plugin cli command
		// To do that run `npx evmts-gen` in the root of your project
		ignoreBuildErrors: true,
	},
	reactStrictMode: true,
	webpack: (config) => {
		config.plugins.push(webpackPluginEvmts())
		config.resolve.fallback = { fs: false, net: false, tls: false }
		return config
	},
}
