export declare const opBNB: import('../../types/utils.js').Assign<
	{
		readonly id: 204
		readonly name: 'opBNB'
		readonly network: 'opBNB Mainnet'
		readonly nativeCurrency: {
			readonly name: 'BNB'
			readonly symbol: 'BNB'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly public: {
				readonly http: readonly ['https://opbnb-mainnet-rpc.bnbchain.org']
			}
			readonly default: {
				readonly http: readonly ['https://opbnb-mainnet-rpc.bnbchain.org']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'opbnbscan'
				readonly url: 'https://mainnet.opbnbscan.com'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xcA11bde05977b3631167028862bE2a173976CA11'
				readonly blockCreated: 512881
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=opBNB.d.ts.map
