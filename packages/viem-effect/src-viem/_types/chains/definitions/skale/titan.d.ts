export declare const skaleTitan: import('../../../types/utils.js').Assign<
	{
		readonly id: 1350216234
		readonly name: 'SKALE | Titan Community Hub'
		readonly network: 'skale-titan'
		readonly nativeCurrency: {
			readonly name: 'sFUEL'
			readonly symbol: 'sFUEL'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly [
					'https://mainnet.skalenodes.com/v1/parallel-stormy-spica',
				]
				readonly webSocket: readonly [
					'wss://mainnet.skalenodes.com/v1/ws/parallel-stormy-spica',
				]
			}
			readonly public: {
				readonly http: readonly [
					'https://mainnet.skalenodes.com/v1/parallel-stormy-spica',
				]
				readonly webSocket: readonly [
					'wss://mainnet.skalenodes.com/v1/ws/parallel-stormy-spica',
				]
			}
		}
		readonly blockExplorers: {
			readonly blockscout: {
				readonly name: 'SKALE Explorer'
				readonly url: 'https://parallel-stormy-spica.explorer.mainnet.skalenodes.com'
			}
			readonly default: {
				readonly name: 'SKALE Explorer'
				readonly url: 'https://parallel-stormy-spica.explorer.mainnet.skalenodes.com'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xcA11bde05977b3631167028862bE2a173976CA11'
				readonly blockCreated: 2076458
			}
		}
	},
	import('../../../types/chain.js').ChainConfig<
		import('../../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=titan.d.ts.map
