export declare const moonbaseAlpha: import('../../types/utils.js').Assign<
	{
		readonly id: 1287
		readonly name: 'Moonbase Alpha'
		readonly network: 'moonbase-alpha'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'DEV'
			readonly symbol: 'DEV'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://rpc.api.moonbase.moonbeam.network']
				readonly webSocket: readonly ['wss://wss.api.moonbase.moonbeam.network']
			}
			readonly public: {
				readonly http: readonly ['https://rpc.api.moonbase.moonbeam.network']
				readonly webSocket: readonly ['wss://wss.api.moonbase.moonbeam.network']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Moonscan'
				readonly url: 'https://moonbase.moonscan.io'
			}
			readonly etherscan: {
				readonly name: 'Moonscan'
				readonly url: 'https://moonbase.moonscan.io'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xcA11bde05977b3631167028862bE2a173976CA11'
				readonly blockCreated: 1850686
			}
		}
		readonly testnet: true
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=moonbaseAlpha.d.ts.map
