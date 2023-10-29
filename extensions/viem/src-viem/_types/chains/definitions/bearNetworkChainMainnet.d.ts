export declare const bearNetworkChainMainnet: import('../../types/utils.js').Assign<
	{
		readonly id: 641230
		readonly name: 'Bear Network Chain Mainnet'
		readonly network: 'BearNetworkChainMainnet'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'BearNetworkChain'
			readonly symbol: 'BRNKC'
		}
		readonly rpcUrls: {
			readonly public: {
				readonly http: readonly ['https://brnkc-mainnet.bearnetwork.net']
			}
			readonly default: {
				readonly http: readonly ['https://brnkc-mainnet.bearnetwork.net']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'BrnkScan'
				readonly url: 'https://brnkscan.bearnetwork.net'
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=bearNetworkChainMainnet.d.ts.map
