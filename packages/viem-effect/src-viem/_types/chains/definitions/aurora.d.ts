export declare const aurora: import('../../types/utils.js').Assign<
	{
		readonly id: 1313161554
		readonly name: 'Aurora'
		readonly network: 'aurora'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'Ether'
			readonly symbol: 'ETH'
		}
		readonly rpcUrls: {
			readonly infura: {
				readonly http: readonly ['https://aurora-mainnet.infura.io/v3']
			}
			readonly default: {
				readonly http: readonly ['https://mainnet.aurora.dev']
			}
			readonly public: {
				readonly http: readonly ['https://mainnet.aurora.dev']
			}
		}
		readonly blockExplorers: {
			readonly etherscan: {
				readonly name: 'Aurorascan'
				readonly url: 'https://aurorascan.dev'
			}
			readonly default: {
				readonly name: 'Aurorascan'
				readonly url: 'https://aurorascan.dev'
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=aurora.d.ts.map
