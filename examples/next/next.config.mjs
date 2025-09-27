// Explorer keys for Etherscan-like APIs
const etherscanApiKeys = {
	ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
	ARBISCAN_API_KEY: process.env.ARBISCAN_API_KEY,
	BASESCAN_API_KEY: process.env.BASESCAN_API_KEY,
	OPTIMISTIC_ETHERSCAN_API_KEY: process.env.OPTIMISTIC_ETHERSCAN_API_KEY,
	POLYGONSCAN_API_KEY: process.env.POLYGONSCAN_API_KEY,
}

Object.keys(etherscanApiKeys).forEach((key) => {
	if (!etherscanApiKeys[key]) {
		console.warn(`No ${key} environment variable set. You may face throttling.`)
	}
})

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	// Temporary hack to fix the top-level await issue in ethereumjs
	webpack: (config) => {
		return config
	},
	// These will get exposed to the browser
	// If you would like to keep this key private, use an API route/server components to
	// access it and return the data instead
	env: {
		ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
	},
}

export default nextConfig
