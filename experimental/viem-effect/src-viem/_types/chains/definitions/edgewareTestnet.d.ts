export declare const edgewareTestnet: import('../../types/utils.js').Assign<
	{
		readonly id: 2022
		readonly name: 'Beresheet BereEVM Testnet'
		readonly network: 'edgewareTestnet'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'Testnet EDG'
			readonly symbol: 'tEDG'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://beresheet-evm.jelliedowl.net']
			}
			readonly public: {
				readonly http: readonly ['https://beresheet-evm.jelliedowl.net']
			}
		}
		readonly blockExplorers: {
			readonly etherscan: {
				readonly name: 'Edgscan by Bharathcoorg'
				readonly url: 'https://testnet.edgscan.live'
			}
			readonly default: {
				readonly name: 'Edgscan by Bharathcoorg'
				readonly url: 'https://testnet.edgscan.live'
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=edgewareTestnet.d.ts.map
