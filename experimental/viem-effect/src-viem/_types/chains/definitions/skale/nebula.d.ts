export declare const skaleNebula: import('../../../types/utils.js').Assign<
	{
		readonly id: 1482601649
		readonly name: 'SKALE | Nebula Gaming Hub'
		readonly network: 'skale-nebula'
		readonly nativeCurrency: {
			readonly name: 'sFUEL'
			readonly symbol: 'sFUEL'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly [
					'https://mainnet.skalenodes.com/v1/green-giddy-denebola',
				]
				readonly webSocket: readonly [
					'wss://mainnet.skalenodes.com/v1/ws/green-giddy-denebola',
				]
			}
			readonly public: {
				readonly http: readonly [
					'https://mainnet.skalenodes.com/v1/green-giddy-denebola',
				]
				readonly webSocket: readonly [
					'wss://mainnet.skalenodes.com/v1/ws/green-giddy-denebola',
				]
			}
		}
		readonly blockExplorers: {
			readonly blockscout: {
				readonly name: 'SKALE Explorer'
				readonly url: 'https://green-giddy-denebola.explorer.mainnet.skalenodes.com'
			}
			readonly default: {
				readonly name: 'SKALE Explorer'
				readonly url: 'https://green-giddy-denebola.explorer.mainnet.skalenodes.com'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xcA11bde05977b3631167028862bE2a173976CA11'
				readonly blockCreated: 2372986
			}
		}
	},
	import('../../../types/chain.js').ChainConfig<
		import('../../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=nebula.d.ts.map
