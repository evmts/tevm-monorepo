export declare const skaleChaosTestnet: import('../../../types/utils.js').Assign<
	{
		readonly id: 1351057110
		readonly name: 'SKALE | Chaos Testnet'
		readonly network: 'skale-chaos-testnet'
		readonly nativeCurrency: {
			readonly name: 'sFUEL'
			readonly symbol: 'sFUEL'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly [
					'https://staging-v3.skalenodes.com/v1/staging-fast-active-bellatrix',
				]
				readonly webSocket: readonly [
					'wss://staging-v3.skalenodes.com/v1/ws/staging-fast-active-bellatrix',
				]
			}
			readonly public: {
				readonly http: readonly [
					'https://staging-v3.skalenodes.com/v1/staging-fast-active-bellatrix',
				]
				readonly webSocket: readonly [
					'wss://staging-v3.skalenodes.com/v1/ws/staging-fast-active-bellatrix',
				]
			}
		}
		readonly blockExplorers: {
			readonly blockscout: {
				readonly name: 'SKALE Explorer'
				readonly url: 'https://staging-fast-active-bellatrix.explorer.staging-v3.skalenodes.com'
			}
			readonly default: {
				readonly name: 'SKALE Explorer'
				readonly url: 'https://staging-fast-active-bellatrix.explorer.staging-v3.skalenodes.com'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xcA11bde05977b3631167028862bE2a173976CA11'
				readonly blockCreated: 1192202
			}
		}
		readonly testnet: true
	},
	import('../../../types/chain.js').ChainConfig<
		import('../../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=chaosTestnet.d.ts.map
