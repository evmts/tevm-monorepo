export declare const skaleBlockBrawlers: import('../../../types/utils.js').Assign<
	{
		readonly id: 391845894
		readonly name: 'SKALE | Block Brawlers'
		readonly network: 'skale-brawl'
		readonly nativeCurrency: {
			readonly name: 'BRAWL'
			readonly symbol: 'BRAWL'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly [
					'https://mainnet.skalenodes.com/v1/frayed-decent-antares',
				]
				readonly webSocket: readonly [
					'wss://mainnet.skalenodes.com/v1/ws/frayed-decent-antares',
				]
			}
			readonly public: {
				readonly http: readonly [
					'https://mainnet.skalenodes.com/v1/frayed-decent-antares',
				]
				readonly webSocket: readonly [
					'wss://mainnet.skalenodes.com/v1/ws/frayed-decent-antares',
				]
			}
		}
		readonly blockExplorers: {
			readonly blockscout: {
				readonly name: 'SKALE Explorer'
				readonly url: 'https://frayed-decent-antares.explorer.mainnet.skalenodes.com'
			}
			readonly default: {
				readonly name: 'SKALE Explorer'
				readonly url: 'https://frayed-decent-antares.explorer.mainnet.skalenodes.com'
			}
		}
		readonly contracts: {}
	},
	import('../../../types/chain.js').ChainConfig<
		import('../../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=brawl.d.ts.map
