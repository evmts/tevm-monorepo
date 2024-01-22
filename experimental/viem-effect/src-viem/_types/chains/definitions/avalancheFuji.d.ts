export declare const avalancheFuji: import('../../types/utils.js').Assign<
	{
		readonly id: 43113
		readonly name: 'Avalanche Fuji'
		readonly network: 'avalanche-fuji'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'Avalanche Fuji'
			readonly symbol: 'AVAX'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://api.avax-test.network/ext/bc/C/rpc']
			}
			readonly public: {
				readonly http: readonly ['https://api.avax-test.network/ext/bc/C/rpc']
			}
		}
		readonly blockExplorers: {
			readonly etherscan: {
				readonly name: 'SnowTrace'
				readonly url: 'https://testnet.snowtrace.io'
			}
			readonly default: {
				readonly name: 'SnowTrace'
				readonly url: 'https://testnet.snowtrace.io'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xca11bde05977b3631167028862be2a173976ca11'
				readonly blockCreated: 7096959
			}
		}
		readonly testnet: true
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=avalancheFuji.d.ts.map
