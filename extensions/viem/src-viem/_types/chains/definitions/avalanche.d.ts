export declare const avalanche: import('../../types/utils.js').Assign<
	{
		readonly id: 43114
		readonly name: 'Avalanche'
		readonly network: 'avalanche'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'Avalanche'
			readonly symbol: 'AVAX'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://api.avax.network/ext/bc/C/rpc']
			}
			readonly public: {
				readonly http: readonly ['https://api.avax.network/ext/bc/C/rpc']
			}
		}
		readonly blockExplorers: {
			readonly etherscan: {
				readonly name: 'SnowTrace'
				readonly url: 'https://snowtrace.io'
			}
			readonly default: {
				readonly name: 'SnowTrace'
				readonly url: 'https://snowtrace.io'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xca11bde05977b3631167028862be2a173976ca11'
				readonly blockCreated: 11907934
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=avalanche.d.ts.map
