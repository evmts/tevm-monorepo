export declare const rollux: import('../../types/utils.js').Assign<
	{
		readonly id: 570
		readonly name: 'Rollux Mainnet'
		readonly network: 'rollux'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'Syscoin'
			readonly symbol: 'SYS'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://rpc.rollux.com']
				readonly webSocket: readonly ['wss://rpc.rollux.com/wss']
			}
			readonly public: {
				readonly http: readonly ['https://rollux.public-rpc.com']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'RolluxExplorer'
				readonly url: 'https://explorer.rollux.com'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xcA11bde05977b3631167028862bE2a173976CA11'
				readonly blockCreated: 119222
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=rollux.d.ts.map
