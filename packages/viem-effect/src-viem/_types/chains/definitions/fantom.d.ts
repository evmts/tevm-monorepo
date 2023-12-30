export declare const fantom: import('../../types/utils.js').Assign<
	{
		readonly id: 250
		readonly name: 'Fantom'
		readonly network: 'fantom'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'Fantom'
			readonly symbol: 'FTM'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://rpc.ankr.com/fantom']
			}
			readonly public: {
				readonly http: readonly ['https://rpc.ankr.com/fantom']
			}
		}
		readonly blockExplorers: {
			readonly etherscan: {
				readonly name: 'FTMScan'
				readonly url: 'https://ftmscan.com'
			}
			readonly default: {
				readonly name: 'FTMScan'
				readonly url: 'https://ftmscan.com'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xca11bde05977b3631167028862be2a173976ca11'
				readonly blockCreated: 33001987
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=fantom.d.ts.map
