export declare const moonriver: import('../../types/utils.js').Assign<
	{
		readonly id: 1285
		readonly name: 'Moonriver'
		readonly network: 'moonriver'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'MOVR'
			readonly symbol: 'MOVR'
		}
		readonly rpcUrls: {
			readonly public: {
				readonly http: readonly ['https://moonriver.public.blastapi.io']
				readonly webSocket: readonly ['wss://moonriver.public.blastapi.io']
			}
			readonly default: {
				readonly http: readonly ['https://moonriver.public.blastapi.io']
				readonly webSocket: readonly ['wss://moonriver.public.blastapi.io']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Moonscan'
				readonly url: 'https://moonriver.moonscan.io'
			}
			readonly etherscan: {
				readonly name: 'Moonscan'
				readonly url: 'https://moonriver.moonscan.io'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xcA11bde05977b3631167028862bE2a173976CA11'
				readonly blockCreated: 1597904
			}
		}
		readonly testnet: false
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=moonriver.d.ts.map
