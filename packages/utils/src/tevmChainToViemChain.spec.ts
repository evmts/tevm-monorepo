import { describe, expect, it } from 'vitest'
import { tevmChainToViemChain } from './tevmChainToViemChain.js'

describe('tevmChainToViemChain', () => {
	it('should convert basic chain with HTTP RPCs', () => {
		const tevmChain = {
			chainId: 14,
			name: 'Flare Mainnet',
			chain: 'FLR',
			shortName: 'flr',
			rpc: ['https://flare-api.flare.network/ext/C/rpc', 'https://rpc.ankr.com/flare'],
			nativeCurrency: {
				name: 'Flare',
				symbol: 'FLR',
				decimals: 18,
			},
			explorers: [
				{
					name: 'Flarescan',
					url: 'https://flarescan.com',
				},
			],
		}

		const result = tevmChainToViemChain(tevmChain)

		expect(result.id).toBe(14)
		expect(result.name).toBe('Flare Mainnet')
		expect(result.nativeCurrency).toEqual({
			name: 'Flare',
			symbol: 'FLR',
			decimals: 18,
		})
		expect(result.rpcUrls.default.http).toEqual([
			'https://flare-api.flare.network/ext/C/rpc',
			'https://rpc.ankr.com/flare',
		])
		expect(result.blockExplorers?.default).toEqual({
			name: 'Flarescan',
			url: 'https://flarescan.com',
		})
	})

	it('should handle chains with WebSocket RPCs', () => {
		const tevmChain = {
			chainId: 10,
			name: 'OP Mainnet',
			chain: 'OP',
			shortName: 'op',
			rpc: ['https://mainnet.optimism.io', 'wss://mainnet.optimism.io'],
			nativeCurrency: {
				name: 'Ether',
				symbol: 'ETH',
				decimals: 18,
			},
		}

		const result = tevmChainToViemChain(tevmChain)

		expect(result.rpcUrls.default.http).toEqual(['https://mainnet.optimism.io'])
		expect(result.rpcUrls.default.webSocket).toEqual(['wss://mainnet.optimism.io'])
	})

	it('should handle chains without explorers', () => {
		const tevmChain = {
			chainId: 999,
			name: 'Test Chain',
			chain: 'TEST',
			shortName: 'test',
			rpc: ['https://rpc.testchain.com'],
			nativeCurrency: {
				name: 'Test',
				symbol: 'TEST',
				decimals: 18,
			},
		}

		const result = tevmChainToViemChain(tevmChain)

		expect(result.blockExplorers).toBeUndefined()
	})

	it('should handle multiple block explorers', () => {
		const tevmChain = {
			chainId: 1,
			name: 'Ethereum',
			chain: 'ETH',
			shortName: 'eth',
			rpc: ['https://cloudflare-eth.com'],
			nativeCurrency: {
				name: 'Ether',
				symbol: 'ETH',
				decimals: 18,
			},
			explorers: [
				{
					name: 'Etherscan',
					url: 'https://etherscan.io',
				},
				{
					name: 'Blockscout',
					url: 'https://eth.blockscout.com',
				},
			],
		}

		const result = tevmChainToViemChain(tevmChain)

		expect(result.blockExplorers?.default).toEqual({
			name: 'Etherscan',
			url: 'https://etherscan.io',
		})
		expect(result.blockExplorers?.blockscout).toEqual({
			name: 'Blockscout',
			url: 'https://eth.blockscout.com',
		})
	})

	it('should handle testnet flag', () => {
		const tevmChain = {
			chainId: 11155111,
			name: 'Sepolia',
			chain: 'ETH',
			shortName: 'sep',
			rpc: ['https://rpc.sepolia.org'],
			nativeCurrency: {
				name: 'Sepolia Ether',
				symbol: 'ETH',
				decimals: 18,
			},
			testnet: true,
		}

		const result = tevmChainToViemChain(tevmChain)

		expect(result.testnet).toBe(true)
	})

	it('should provide default native currency if missing', () => {
		const tevmChain = {
			chainId: 123,
			name: 'No Currency Chain',
			chain: 'NC',
			shortName: 'nc',
			rpc: ['https://rpc.nocurrency.com'],
		}

		const result = tevmChainToViemChain(tevmChain)

		expect(result.nativeCurrency).toEqual({
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18,
		})
	})

	it('should handle empty RPC array', () => {
		const tevmChain = {
			chainId: 456,
			name: 'No RPC Chain',
			chain: 'NR',
			shortName: 'nr',
			rpc: [],
			nativeCurrency: {
				name: 'NoRPC',
				symbol: 'NR',
				decimals: 18,
			},
		}

		const result = tevmChainToViemChain(tevmChain)

		expect(result.rpcUrls.default.http).toEqual([''])
	})
})
