export declare const bearNetworkChainTestnet: import('../../types/utils.js').Assign<
	{
		readonly id: 751230
		readonly name: 'Bear Network Chain Testnet'
		readonly network: 'BearNetworkChainTestnet'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'tBRNKC'
			readonly symbol: 'tBRNKC'
		}
		readonly rpcUrls: {
			readonly public: {
				readonly http: readonly ['https://brnkc-test.bearnetwork.net']
			}
			readonly default: {
				readonly http: readonly ['https://brnkc-test.bearnetwork.net']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'BrnkTestScan'
				readonly url: 'https://brnktest-scan.bearnetwork.net'
			}
		}
		readonly testnet: true
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=bearNetworkChainTestnet.d.ts.map
