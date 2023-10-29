export declare const auroraTestnet: import('../../types/utils.js').Assign<
	{
		readonly id: 1313161555
		readonly name: 'Aurora Testnet'
		readonly network: 'aurora-testnet'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'Ether'
			readonly symbol: 'ETH'
		}
		readonly rpcUrls: {
			readonly infura: {
				readonly http: readonly ['https://aurora-testnet.infura.io/v3']
			}
			readonly default: {
				readonly http: readonly ['https://testnet.aurora.dev']
			}
			readonly public: {
				readonly http: readonly ['https://testnet.aurora.dev']
			}
		}
		readonly blockExplorers: {
			readonly etherscan: {
				readonly name: 'Aurorascan'
				readonly url: 'https://testnet.aurorascan.dev'
			}
			readonly default: {
				readonly name: 'Aurorascan'
				readonly url: 'https://testnet.aurorascan.dev'
			}
		}
		readonly testnet: true
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=auroraTestnet.d.ts.map
