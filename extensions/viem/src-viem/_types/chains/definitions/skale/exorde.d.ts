export declare const skaleExorde: import('../../../types/utils.js').Assign<
	{
		readonly id: 2139927552
		readonly name: 'SKALE | Exorde'
		readonly network: 'skale-exorde'
		readonly nativeCurrency: {
			readonly name: 'sFUEL'
			readonly symbol: 'sFUEL'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly [
					'https://mainnet.skalenodes.com/v1/light-vast-diphda',
				]
				readonly webSocket: readonly [
					'wss://mainnet.skalenodes.com/v1/ws/light-vast-diphda',
				]
			}
			readonly public: {
				readonly http: readonly [
					'https://mainnet.skalenodes.com/v1/light-vast-diphda',
				]
				readonly webSocket: readonly [
					'wss://mainnet.skalenodes.com/v1/ws/light-vast-diphda',
				]
			}
		}
		readonly blockExplorers: {
			readonly blockscout: {
				readonly name: 'SKALE Explorer'
				readonly url: 'https://light-vast-diphda.explorer.mainnet.skalenodes.com'
			}
			readonly default: {
				readonly name: 'SKALE Explorer'
				readonly url: 'https://light-vast-diphda.explorer.mainnet.skalenodes.com'
			}
		}
		readonly contracts: {}
	},
	import('../../../types/chain.js').ChainConfig<
		import('../../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=exorde.d.ts.map
