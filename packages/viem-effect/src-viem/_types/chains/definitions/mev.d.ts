export declare const mev: import('../../types/utils.js').Assign<
	{
		readonly id: 7518
		readonly network: 'MEVerse'
		readonly name: 'MEVerse Chain Mainnet'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'MEVerse'
			readonly symbol: 'MEV'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://rpc.meversemainnet.io']
			}
			readonly public: {
				readonly http: readonly ['https://rpc.meversemainnet.io']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Explorer'
				readonly url: 'https://www.meversescan.io'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xca11bde05977b3631167028862be2a173976ca11'
				readonly blockCreated: 86881340
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=mev.d.ts.map
