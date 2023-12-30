export declare const skaleCalypso: import('../../../types/utils.js').Assign<
	{
		readonly id: 1564830818
		readonly name: 'SKALE | Calypso NFT Hub'
		readonly network: 'skale-calypso'
		readonly nativeCurrency: {
			readonly name: 'sFUEL'
			readonly symbol: 'sFUEL'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly [
					'https://mainnet.skalenodes.com/v1/honorable-steel-rasalhague',
				]
				readonly webSocket: readonly [
					'wss://mainnet.skalenodes.com/v1/ws/honorable-steel-rasalhague',
				]
			}
			readonly public: {
				readonly http: readonly [
					'https://mainnet.skalenodes.com/v1/honorable-steel-rasalhague',
				]
				readonly webSocket: readonly [
					'wss://mainnet.skalenodes.com/v1/ws/honorable-steel-rasalhague',
				]
			}
		}
		readonly blockExplorers: {
			readonly blockscout: {
				readonly name: 'SKALE Explorer'
				readonly url: 'https://honorable-steel-rasalhague.explorer.mainnet.skalenodes.com'
			}
			readonly default: {
				readonly name: 'SKALE Explorer'
				readonly url: 'https://honorable-steel-rasalhague.explorer.mainnet.skalenodes.com'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xcA11bde05977b3631167028862bE2a173976CA11'
				readonly blockCreated: 3107626
			}
		}
	},
	import('../../../types/chain.js').ChainConfig<
		import('../../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=calypso.d.ts.map
