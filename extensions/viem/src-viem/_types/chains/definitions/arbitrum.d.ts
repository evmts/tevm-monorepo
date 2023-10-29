export declare const arbitrum: import('../../types/utils.js').Assign<
	{
		readonly id: 42161
		readonly name: 'Arbitrum One'
		readonly network: 'arbitrum'
		readonly nativeCurrency: {
			readonly name: 'Ether'
			readonly symbol: 'ETH'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly alchemy: {
				readonly http: readonly ['https://arb-mainnet.g.alchemy.com/v2']
				readonly webSocket: readonly ['wss://arb-mainnet.g.alchemy.com/v2']
			}
			readonly infura: {
				readonly http: readonly ['https://arbitrum-mainnet.infura.io/v3']
				readonly webSocket: readonly ['wss://arbitrum-mainnet.infura.io/ws/v3']
			}
			readonly default: {
				readonly http: readonly ['https://arb1.arbitrum.io/rpc']
			}
			readonly public: {
				readonly http: readonly ['https://arb1.arbitrum.io/rpc']
			}
		}
		readonly blockExplorers: {
			readonly etherscan: {
				readonly name: 'Arbiscan'
				readonly url: 'https://arbiscan.io'
			}
			readonly default: {
				readonly name: 'Arbiscan'
				readonly url: 'https://arbiscan.io'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xca11bde05977b3631167028862be2a173976ca11'
				readonly blockCreated: 7654707
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=arbitrum.d.ts.map
