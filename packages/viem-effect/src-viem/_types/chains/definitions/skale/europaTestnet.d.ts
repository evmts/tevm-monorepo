export declare const skaleEuropaTestnet: import('../../../types/utils.js').Assign<
	{
		readonly id: 476158412
		readonly name: 'SKALE | Europa Liquidity Hub Testnet'
		readonly network: 'skale-europa-testnet'
		readonly nativeCurrency: {
			readonly name: 'sFUEL'
			readonly symbol: 'sFUEL'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly [
					'https://staging-v3.skalenodes.com/v1/staging-legal-crazy-castor',
				]
				readonly webSocket: readonly [
					'wss://staging-v3.skalenodes.com/v1/ws/staging-legal-crazy-castor',
				]
			}
			readonly public: {
				readonly http: readonly [
					'https://staging-v3.skalenodes.com/v1/staging-legal-crazy-castor',
				]
				readonly webSocket: readonly [
					'wss://staging-v3.skalenodes.com/v1/ws/staging-legal-crazy-castor',
				]
			}
		}
		readonly blockExplorers: {
			readonly blockscout: {
				readonly name: 'SKALE Explorer'
				readonly url: 'https://staging-legal-crazy-castor.explorer.staging-v3.skalenodes.com'
			}
			readonly default: {
				readonly name: 'SKALE Explorer'
				readonly url: 'https://staging-legal-crazy-castor.explorer.staging-v3.skalenodes.com'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xcA11bde05977b3631167028862bE2a173976CA11'
				readonly blockCreated: 2071911
			}
		}
		readonly testnet: true
	},
	import('../../../types/chain.js').ChainConfig<
		import('../../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=europaTestnet.d.ts.map
