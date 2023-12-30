export declare const opBNBTestnet: import('../../types/utils.js').Assign<
	{
		readonly id: 5611
		readonly name: 'opBNB Testnet'
		readonly network: 'opBNB Testnet'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'tBNB'
			readonly symbol: 'tBNB'
		}
		readonly rpcUrls: {
			readonly public: {
				readonly http: readonly ['https://opbnb-testnet-rpc.bnbchain.org']
			}
			readonly default: {
				readonly http: readonly ['https://opbnb-testnet-rpc.bnbchain.org']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'opbnbscan'
				readonly url: 'https://opbnbscan.com'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xcA11bde05977b3631167028862bE2a173976CA11'
				readonly blockCreated: 3705108
			}
		}
		readonly testnet: true
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=opBNBTestnet.d.ts.map
