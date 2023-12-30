export declare const meterTestnet: import('../../types/utils.js').Assign<
	{
		readonly id: 83
		readonly name: 'Meter Testnet'
		readonly network: 'meter-testnet'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'MTR'
			readonly symbol: 'MTR'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://rpctest.meter.io']
			}
			readonly public: {
				readonly http: readonly ['https://rpctest.meter.io']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'MeterTestnetScan'
				readonly url: 'https://scan-warringstakes.meter.io'
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=meterTestnet.d.ts.map
