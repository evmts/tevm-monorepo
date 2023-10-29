export declare const filecoinCalibration: import('../../types/utils.js').Assign<
	{
		readonly id: 314159
		readonly name: 'Filecoin Calibration'
		readonly network: 'filecoin-calibration'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'testnet filecoin'
			readonly symbol: 'tFIL'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://api.calibration.node.glif.io/rpc/v1']
			}
			readonly public: {
				readonly http: readonly ['https://api.calibration.node.glif.io/rpc/v1']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Filscan'
				readonly url: 'https://calibration.filscan.io'
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=filecoinCalibration.d.ts.map
