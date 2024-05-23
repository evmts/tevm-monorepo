import { http } from 'viem'
import { loadBalance, rateLimit } from '@ponder/utils'
import { mainnet as viemMainnet, optimism as viemOptimism } from 'viem/chains'

const mainnetRpcUrls = process.env['TEVM_RPC_URLS_MAINNET']?.split(',') ?? []
const optimismRpcUrls = process.env['TEVM_RPC_URLS_OPTIMISM']?.split(',') ?? []

const mainnet = loadBalance(
	mainnetRpcUrls.map((url) => rateLimit(http(url), { browser: false, requestsPerSecond: 25 })),
)({retryCount: 3, chain: viemMainnet})

const optimism = loadBalance(
	optimismRpcUrls.map((url) => rateLimit(http(url), { browser: false, requestsPerSecond: 25 })),
)({retryCount: 3, chain: viemOptimism})

export const transports = {
	mainnet,
	optimism,
}
