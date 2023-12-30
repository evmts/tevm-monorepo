export declare const ronin: import('../../types/utils.js').Assign<
	{
		readonly id: 2020
		readonly name: 'Ronin'
		readonly network: 'ronin'
		readonly nativeCurrency: {
			readonly name: 'RON'
			readonly symbol: 'RON'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://api.roninchain.com/rpc']
			}
			readonly public: {
				readonly http: readonly ['https://api.roninchain.com/rpc']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Ronin Explorer'
				readonly url: 'https://app.roninchain.com'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xca11bde05977b3631167028862be2a173976ca11'
				readonly blockCreated: 26023535
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=ronin.d.ts.map
