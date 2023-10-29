export declare const saigon: import('../../types/utils.js').Assign<
	{
		readonly id: 2021
		readonly name: 'Saigon Testnet'
		readonly network: 'saigon'
		readonly nativeCurrency: {
			readonly name: 'RON'
			readonly symbol: 'RON'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://saigon-testnet.roninchain.com/rpc']
			}
			readonly public: {
				readonly http: readonly ['https://saigon-testnet.roninchain.com/rpc']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Saigon Explorer'
				readonly url: 'https://saigon-explorer.roninchain.com'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xca11bde05977b3631167028862be2a173976ca11'
				readonly blockCreated: 18736871
			}
		}
		readonly testnet: true
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=saigon.d.ts.map
