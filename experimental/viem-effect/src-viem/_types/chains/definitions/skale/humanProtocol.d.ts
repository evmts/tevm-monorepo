export declare const skaleHumanProtocol: import('../../../types/utils.js').Assign<
	{
		readonly id: 1273227453
		readonly name: 'SKALE | Human Protocol'
		readonly network: 'skale-human-protocol'
		readonly nativeCurrency: {
			readonly name: 'sFUEL'
			readonly symbol: 'sFUEL'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly [
					'https://mainnet.skalenodes.com/v1/wan-red-ain',
				]
				readonly webSocket: readonly [
					'wss://mainnet.skalenodes.com/v1/ws/wan-red-ain',
				]
			}
			readonly public: {
				readonly http: readonly [
					'https://mainnet.skalenodes.com/v1/wan-red-ain',
				]
				readonly webSocket: readonly [
					'wss://mainnet.skalenodes.com/v1/ws/wan-red-ain',
				]
			}
		}
		readonly blockExplorers: {
			readonly blockscout: {
				readonly name: 'SKALE Explorer'
				readonly url: 'https://wan-red-ain.explorer.mainnet.skalenodes.com'
			}
			readonly default: {
				readonly name: 'SKALE Explorer'
				readonly url: 'https://wan-red-ain.explorer.mainnet.skalenodes.com'
			}
		}
		readonly contracts: {}
	},
	import('../../../types/chain.js').ChainConfig<
		import('../../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=humanProtocol.d.ts.map
