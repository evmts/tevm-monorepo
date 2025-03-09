import { loadBalance, rateLimit } from '@ponder/utils'
import { http } from 'viem'
import { mainnet as viemMainnet, optimism as viemOptimism } from 'viem/chains'

const mainnetRpcUrls = process.env['TEVM_RPC_URLS_MAINNET']?.split(',') ?? []
const optimismRpcUrls = process.env['TEVM_RPC_URLS_OPTIMISM']?.split(',') ?? []

if (mainnetRpcUrls.length === 0) {
	console.warn('TEVM_RPC_URLS_MAINNET is not set')
}
if (optimismRpcUrls.length === 0) {
	console.warn('TEVM_RPC_URLS_OPTIMISM is not set')
}

const mainnet = loadBalance(
	mainnetRpcUrls.map((url) => rateLimit(http(url), { browser: false, requestsPerSecond: 150 })),
)({ retryCount: 3, chain: viemMainnet })

const optimism = loadBalance(
	optimismRpcUrls.map((url) => rateLimit(http(url), { browser: false, requestsPerSecond: 150 })),
)({ retryCount: 3, chain: viemOptimism })

export const transports = {
	mainnet,
	optimism,
}
