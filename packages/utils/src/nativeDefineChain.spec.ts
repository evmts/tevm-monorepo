import { describe, it, expect } from 'vitest'
import { nativeDefineChain } from './nativeDefineChain.js'
import type { Chain } from './chain-types.js'

describe('nativeDefineChain', () => {
	it('should define a basic chain', () => {
		const chain = nativeDefineChain({
			id: 1,
			name: 'Ethereum',
			nativeCurrency: {
				name: 'Ether',
				symbol: 'ETH',
				decimals: 18,
			},
			rpcUrls: {
				default: {
					http: ['https://cloudflare-eth.com'],
				},
			},
		})

		expect(chain.id).toBe(1)
		expect(chain.name).toBe('Ethereum')
		expect(chain.nativeCurrency.name).toBe('Ether')
		expect(chain.nativeCurrency.symbol).toBe('ETH')
		expect(chain.nativeCurrency.decimals).toBe(18)
		expect(chain.rpcUrls.default.http).toEqual(['https://cloudflare-eth.com'])
	})

	it('should define a chain with block explorers', () => {
		const chain = nativeDefineChain({
			id: 1,
			name: 'Ethereum',
			nativeCurrency: {
				name: 'Ether',
				symbol: 'ETH',
				decimals: 18,
			},
			rpcUrls: {
				default: {
					http: ['https://cloudflare-eth.com'],
				},
			},
			blockExplorers: {
				default: {
					name: 'Etherscan',
					url: 'https://etherscan.io',
					apiUrl: 'https://api.etherscan.io/api',
				},
			},
		})

		expect(chain.blockExplorers?.default.name).toBe('Etherscan')
		expect(chain.blockExplorers?.default.url).toBe('https://etherscan.io')
		expect(chain.blockExplorers?.default.apiUrl).toBe('https://api.etherscan.io/api')
	})

	it('should define a chain with contracts', () => {
		const chain = nativeDefineChain({
			id: 1,
			name: 'Ethereum',
			nativeCurrency: {
				name: 'Ether',
				symbol: 'ETH',
				decimals: 18,
			},
			rpcUrls: {
				default: {
					http: ['https://cloudflare-eth.com'],
				},
			},
			contracts: {
				multicall3: {
					address: '0xcA11bde05977b3631167028862bE2a173976CA11',
					blockCreated: 14353601,
				},
				ensRegistry: {
					address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
				},
			},
		})

		expect(chain.contracts?.multicall3?.address).toBe('0xcA11bde05977b3631167028862bE2a173976CA11')
		expect(chain.contracts?.multicall3?.blockCreated).toBe(14353601)
		expect(chain.contracts?.ensRegistry?.address).toBe('0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e')
	})

	it('should define a chain with WebSocket RPC URLs', () => {
		const chain = nativeDefineChain({
			id: 1,
			name: 'Ethereum',
			nativeCurrency: {
				name: 'Ether',
				symbol: 'ETH',
				decimals: 18,
			},
			rpcUrls: {
				default: {
					http: ['https://cloudflare-eth.com'],
					webSocket: ['wss://mainnet.infura.io/ws/v3/key'],
				},
				infura: {
					http: ['https://mainnet.infura.io/v3/key'],
					webSocket: ['wss://mainnet.infura.io/ws/v3/key'],
				},
			},
		})

		expect(chain.rpcUrls.default.webSocket).toEqual(['wss://mainnet.infura.io/ws/v3/key'])
		expect(chain.rpcUrls.infura.http).toEqual(['https://mainnet.infura.io/v3/key'])
	})

	it('should define a testnet', () => {
		const chain = nativeDefineChain({
			id: 11155111,
			name: 'Sepolia',
			nativeCurrency: {
				name: 'Sepolia Ether',
				symbol: 'ETH',
				decimals: 18,
			},
			rpcUrls: {
				default: {
					http: ['https://rpc.sepolia.org'],
				},
			},
			testnet: true,
		})

		expect(chain.id).toBe(11155111)
		expect(chain.name).toBe('Sepolia')
		expect(chain.testnet).toBe(true)
	})

	it('should define an L2 chain with sourceId', () => {
		const chain = nativeDefineChain({
			id: 10,
			name: 'OP Mainnet',
			nativeCurrency: {
				name: 'Ether',
				symbol: 'ETH',
				decimals: 18,
			},
			rpcUrls: {
				default: {
					http: ['https://mainnet.optimism.io'],
				},
			},
			sourceId: 1, // Ethereum mainnet
		})

		expect(chain.id).toBe(10)
		expect(chain.sourceId).toBe(1)
	})

	it('should define a chain with block time', () => {
		const chain = nativeDefineChain({
			id: 1,
			name: 'Ethereum',
			nativeCurrency: {
				name: 'Ether',
				symbol: 'ETH',
				decimals: 18,
			},
			rpcUrls: {
				default: {
					http: ['https://cloudflare-eth.com'],
				},
			},
			blockTime: 12000, // 12 seconds in ms
		})

		expect(chain.blockTime).toBe(12000)
	})

	it('should define a chain with ENS TLDs', () => {
		const chain = nativeDefineChain({
			id: 1,
			name: 'Ethereum',
			nativeCurrency: {
				name: 'Ether',
				symbol: 'ETH',
				decimals: 18,
			},
			rpcUrls: {
				default: {
					http: ['https://cloudflare-eth.com'],
				},
			},
			ensTlds: ['eth', 'xyz'],
		})

		expect(chain.ensTlds).toEqual(['eth', 'xyz'])
	})

	it('should define a chain with custom data', () => {
		const chain = nativeDefineChain({
			id: 1,
			name: 'Ethereum',
			nativeCurrency: {
				name: 'Ether',
				symbol: 'ETH',
				decimals: 18,
			},
			rpcUrls: {
				default: {
					http: ['https://cloudflare-eth.com'],
				},
			},
			custom: {
				myCustomProperty: 'myValue',
				anotherProperty: 123,
			},
		})

		expect(chain.custom?.myCustomProperty).toBe('myValue')
		expect(chain.custom?.anotherProperty).toBe(123)
	})

	it('should preserve the exact chain object passed in', () => {
		const originalChain = {
			id: 42161,
			name: 'Arbitrum One',
			nativeCurrency: {
				name: 'Ether',
				symbol: 'ETH',
				decimals: 18,
			},
			rpcUrls: {
				default: {
					http: ['https://arb1.arbitrum.io/rpc'],
				},
			},
		} as const

		const definedChain = nativeDefineChain(originalChain)

		// Should be the exact same object reference
		expect(definedChain).toBe(originalChain)
	})

	it('should be type-compatible with viem Chain type', () => {
		// This test validates that the chain type is structurally compatible
		const chain: Chain = nativeDefineChain({
			id: 1,
			name: 'Ethereum',
			nativeCurrency: {
				name: 'Ether',
				symbol: 'ETH',
				decimals: 18,
			},
			rpcUrls: {
				default: {
					http: ['https://cloudflare-eth.com'],
				},
			},
		})

		// TypeScript would fail if the types weren't compatible
		expect(chain).toBeDefined()
	})
})
