export declare const skaleTitanTestnet: import('../../../types/utils.js').Assign<
	{
		readonly id: 1517929550
		readonly name: 'SKALE | Titan Community Hub Testnet'
		readonly network: 'skale-titan-testnet'
		readonly nativeCurrency: {
			readonly name: 'sFUEL'
			readonly symbol: 'sFUEL'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly [
					'https://staging-v3.skalenodes.com/v1/staging-aware-chief-gianfar',
				]
				readonly webSocket: readonly [
					'wss://staging-v3.skalenodes.com/v1/ws/staging-aware-chief-gianfar',
				]
			}
			readonly public: {
				readonly http: readonly [
					'https://staging-v3.skalenodes.com/v1/staging-aware-chief-gianfar',
				]
				readonly webSocket: readonly [
					'wss://staging-v3.skalenodes.com/v1/ws/staging-aware-chief-gianfar',
				]
			}
		}
		readonly blockExplorers: {
			readonly blockscout: {
				readonly name: 'SKALE Explorer'
				readonly url: 'https://staging-aware-chief-gianfar.explorer.staging-v3.skalenodes.com'
			}
			readonly default: {
				readonly name: 'SKALE Explorer'
				readonly url: 'https://staging-aware-chief-gianfar.explorer.staging-v3.skalenodes.com'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xcA11bde05977b3631167028862bE2a173976CA11'
				readonly blockCreated: 2085155
			}
		}
		readonly testnet: true
	},
	import('../../../types/chain.js').ChainConfig<
		import('../../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=titanTestnet.d.ts.map
