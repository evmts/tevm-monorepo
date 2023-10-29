export declare const skaleCalypsoTestnet: import('../../../types/utils.js').Assign<
	{
		readonly id: 344106930
		readonly name: 'SKALE | Calypso NFT Hub Testnet'
		readonly network: 'skale-calypso-testnet'
		readonly nativeCurrency: {
			readonly name: 'sFUEL'
			readonly symbol: 'sFUEL'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly [
					'https://staging-v3.skalenodes.com/v1/staging-utter-unripe-menkar',
				]
				readonly webSocket: readonly [
					'wss://staging-v3.skalenodes.com/v1/ws/staging-utter-unripe-menkar',
				]
			}
			readonly public: {
				readonly http: readonly [
					'https://staging-v3.skalenodes.com/v1/staging-utter-unripe-menkar',
				]
				readonly webSocket: readonly [
					'wss://staging-v3.skalenodes.com/v1/ws/staging-utter-unripe-menkar',
				]
			}
		}
		readonly blockExplorers: {
			readonly blockscout: {
				readonly name: 'SKALE Explorer'
				readonly url: 'https://staging-utter-unripe-menkar.explorer.staging-v3.skalenodes.com'
			}
			readonly default: {
				readonly name: 'SKALE Explorer'
				readonly url: 'https://staging-utter-unripe-menkar.explorer.staging-v3.skalenodes.com'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xcA11bde05977b3631167028862bE2a173976CA11'
				readonly blockCreated: 2131424
			}
		}
		readonly testnet: true
	},
	import('../../../types/chain.js').ChainConfig<
		import('../../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=calypsoTestnet.d.ts.map
