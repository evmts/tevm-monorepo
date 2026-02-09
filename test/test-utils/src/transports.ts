import { loadBalance, rateLimit } from '@ponder/utils'
import { http } from 'viem'
import { mainnet as viemMainnet, optimism as viemOptimism } from 'viem/chains'

const defaultMainnetRpcUrls = [
	'https://eth.llamarpc.com',
	'https://ethereum-rpc.publicnode.com',
	'https://rpc.flashbots.net',
]

const defaultOptimismRpcUrls = [
	'https://optimism.llamarpc.com',
	'https://optimism-rpc.publicnode.com',
	'https://mainnet.optimism.io',
]

const getRpcUrls = (envVar: 'TEVM_RPC_URLS_MAINNET' | 'TEVM_RPC_URLS_OPTIMISM', fallbacks: string[]) => {
	const configuredUrls = (process.env[envVar] ?? '')
		.split(',')
		.map((url) => url.trim())
		.filter(Boolean)
	if (configuredUrls.length === 0) {
		console.warn(`${envVar} is not set, using built-in public RPC fallbacks`)
	}
	return [...new Set([...configuredUrls, ...fallbacks])]
}

const mainnetRpcUrls = getRpcUrls('TEVM_RPC_URLS_MAINNET', defaultMainnetRpcUrls)
const optimismRpcUrls = getRpcUrls('TEVM_RPC_URLS_OPTIMISM', defaultOptimismRpcUrls)

function createTransport(urls: string[], chain: typeof viemMainnet | typeof viemOptimism) {
	if (urls.length === 0) {
		throw new Error('No RPC URLs configured')
	}
	return loadBalance(urls.map((url) => rateLimit(http(url), { browser: false, requestsPerSecond: 150 })))({
		retryCount: 3,
		chain,
	})
}

const mainnet = createTransport(mainnetRpcUrls, viemMainnet)
const optimism = createTransport(optimismRpcUrls, viemOptimism)

export const transports = {
	mainnet,
	optimism,
}
