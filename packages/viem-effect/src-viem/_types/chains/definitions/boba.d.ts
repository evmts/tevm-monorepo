export declare const boba: import('../../types/utils.js').Assign<
	{
		readonly id: 288
		readonly name: 'Boba Network'
		readonly network: 'boba'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'Boba'
			readonly symbol: 'BOBA'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://mainnet.boba.network']
			}
			readonly public: {
				readonly http: readonly ['https://mainnet.boba.network']
			}
		}
		readonly blockExplorers: {
			readonly etherscan: {
				readonly name: 'BOBAScan'
				readonly url: 'https://bobascan.com'
			}
			readonly default: {
				readonly name: 'BOBAScan'
				readonly url: 'https://bobascan.com'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xca11bde05977b3631167028862be2a173976ca11'
				readonly blockCreated: 446859
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=boba.d.ts.map
