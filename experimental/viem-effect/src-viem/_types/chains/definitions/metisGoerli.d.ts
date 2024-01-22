export declare const metisGoerli: import('../../types/utils.js').Assign<
	{
		readonly id: 599
		readonly name: 'Metis Goerli'
		readonly network: 'metis-goerli'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'Metis Goerli'
			readonly symbol: 'METIS'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://goerli.gateway.metisdevops.link']
			}
			readonly public: {
				readonly http: readonly ['https://goerli.gateway.metisdevops.link']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Metis Goerli Explorer'
				readonly url: 'https://goerli.explorer.metisdevops.link'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xca11bde05977b3631167028862be2a173976ca11'
				readonly blockCreated: 1006207
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=metisGoerli.d.ts.map
