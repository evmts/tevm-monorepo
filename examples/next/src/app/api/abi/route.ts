import { autoload, loaders } from '@shazow/whatsabi'

import { CHAINS } from '@/lib/constants/providers'

const { EtherscanABILoader, MultiABILoader, SourcifyABILoader } = loaders

// The env key for any Etherscan compatible API key, to be parsed inside the api route
// See `Chain.blockExplorers.default.apiUrl` for the base URL
const explorerApiKeys: Record<number, string | undefined> = {
	1: process.env.ETHERSCAN_API_KEY, // Ethereum
	42161: process.env.ARBISCAN_API_KEY, // Arbitrum
	8453: process.env.BASESCAN_API_KEY, // Base
	10: process.env.OPTIMISTIC_ETHERSCAN_API_KEY, // Optimism
	137: process.env.POLYGONSCAN_API_KEY, // Polygon
}

/**
 * @notice Fetch the abi of a given contract using WhatsABI
 * @dev This will first attempt using the Sourcify api (both full and partial matches),
 * and if that fails, it will fall back to the Etherscan api.
 */
export async function POST(req: Request) {
	const { chainId, contractAddress, apiUrl } = await req.json()

	// Retrieve the appropriate provider (we know it exists since the chainId comes from a provider itself)
	// This is necessary since we can't pass the full object (that includes functions) to the api route...
	const provider = CHAINS.find((chain) => chain.id === chainId)?.custom.provider

	// Get the explorer api key from the environment (if it is set + exists for this chain)
	const explorerApiKey = explorerApiKeys[chainId] || ''

	// We can't use the default ABI loader as it doesn't specify the chain id to the loaders
	const loaders = [
		new SourcifyABILoader({ chainId }),
		new EtherscanABILoader({
			baseURL: apiUrl,
			// If the key is there, there is an Etherscan-compatible explorer
			// Whether an api key was fed to the environment or not (default ''), it will
			// still work, in the worst case with a rate limit
			apiKey: explorerApiKey,
		}),
	]

	if (!provider) {
		throw new Error('no provider found')
	}

	try {
		const res = await autoload(contractAddress, {
			provider,
			// If there is no Etherscan-like api, we can't use the EtherscanABILoader
			abiLoader: apiUrl ? new MultiABILoader(loaders) : loaders[1],
		})

		return Response.json({ success: true, data: res.abi })
	} catch (err) {
		console.log(err)
		return Response.json({ error: 'Failed to fetch abi' })
	}
}
