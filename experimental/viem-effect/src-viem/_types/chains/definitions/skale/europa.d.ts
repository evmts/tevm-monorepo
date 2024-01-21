export declare const skaleEuropa: import('../../../types/utils.js').Assign<
	{
		readonly id: 2046399126
		readonly name: 'SKALE | Europa Liquidity Hub'
		readonly network: 'skale-europa'
		readonly nativeCurrency: {
			readonly name: 'sFUEL'
			readonly symbol: 'sFUEL'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly [
					'https://mainnet.skalenodes.com/v1/elated-tan-skat',
				]
				readonly webSocket: readonly [
					'wss://mainnet.skalenodes.com/v1/ws/elated-tan-skat',
				]
			}
			readonly public: {
				readonly http: readonly [
					'https://mainnet.skalenodes.com/v1/elated-tan-skat',
				]
				readonly webSocket: readonly [
					'wss://mainnet.skalenodes.com/v1/ws/elated-tan-skat',
				]
			}
		}
		readonly blockExplorers: {
			readonly blockscout: {
				readonly name: 'SKALE Explorer'
				readonly url: 'https://elated-tan-skat.explorer.mainnet.skalenodes.com'
			}
			readonly default: {
				readonly name: 'SKALE Explorer'
				readonly url: 'https://elated-tan-skat.explorer.mainnet.skalenodes.com'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xcA11bde05977b3631167028862bE2a173976CA11'
				readonly blockCreated: 3113495
			}
		}
	},
	import('../../../types/chain.js').ChainConfig<
		import('../../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=europa.d.ts.map
