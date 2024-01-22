export declare const plinga: import('../../types/utils.js').Assign<
	{
		readonly id: 242
		readonly name: 'Plinga'
		readonly network: 'plinga'
		readonly nativeCurrency: {
			readonly name: 'Plinga'
			readonly symbol: 'PLINGA'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://rpcurl.mainnet.plgchain.com']
			}
			readonly public: {
				readonly http: readonly ['https://rpcurl.mainnet.plgchain.com']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Plgscan'
				readonly url: 'https://www.plgscan.com'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0x0989576160f2e7092908BB9479631b901060b6e4'
				readonly blockCreated: 204489
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=plinga.d.ts.map
