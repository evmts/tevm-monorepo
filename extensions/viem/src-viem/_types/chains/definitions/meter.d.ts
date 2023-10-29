export declare const meter: import('../../types/utils.js').Assign<
	{
		readonly id: 82
		readonly name: 'Meter'
		readonly network: 'meter'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'MTR'
			readonly symbol: 'MTR'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://rpc.meter.io']
			}
			readonly public: {
				readonly http: readonly ['https://rpc.meter.io']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'MeterScan'
				readonly url: 'https://scan.meter.io'
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=meter.d.ts.map
