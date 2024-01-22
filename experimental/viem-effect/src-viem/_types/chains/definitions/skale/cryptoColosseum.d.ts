export declare const skaleCryptoColosseum: import('../../../types/utils.js').Assign<
	{
		readonly id: 2046399126
		readonly name: 'SKALE | Crypto Colosseum'
		readonly network: 'skale-crypto-coloseeum'
		readonly nativeCurrency: {
			readonly name: 'sFUEL'
			readonly symbol: 'sFUEL'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly [
					'https://mainnet.skalenodes.com/v1/haunting-devoted-deneb',
				]
				readonly webSocket: readonly [
					'wss://mainnet.skalenodes.com/v1/ws/haunting-devoted-deneb',
				]
			}
			readonly public: {
				readonly http: readonly [
					'https://mainnet.skalenodes.com/v1/haunting-devoted-deneb',
				]
				readonly webSocket: readonly [
					'wss://mainnet.skalenodes.com/v1/ws/haunting-devoted-deneb',
				]
			}
		}
		readonly blockExplorers: {
			readonly blockscout: {
				readonly name: 'SKALE Explorer'
				readonly url: 'https://haunting-devoted-deneb.explorer.mainnet.skalenodes.com'
			}
			readonly default: {
				readonly name: 'SKALE Explorer'
				readonly url: 'https://haunting-devoted-deneb.explorer.mainnet.skalenodes.com'
			}
		}
		readonly contracts: {}
	},
	import('../../../types/chain.js').ChainConfig<
		import('../../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=cryptoColosseum.d.ts.map
