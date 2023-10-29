export declare const rolluxTestnet: import('../../types/utils.js').Assign<
	{
		readonly id: 57000
		readonly name: 'Rollux Testnet'
		readonly network: 'rollux-testnet'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'Syscoin'
			readonly symbol: 'SYS'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://rpc-tanenbaum.rollux.com/']
				readonly webSocket: readonly ['wss://rpc-tanenbaum.rollux.com/wss']
			}
			readonly public: {
				readonly http: readonly ['https://rpc-tanenbaum.rollux.com/']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'RolluxTestnetExplorer'
				readonly url: 'https://rollux.tanenbaum.io'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xcA11bde05977b3631167028862bE2a173976CA11'
				readonly blockCreated: 1813675
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=rolluxTestnet.d.ts.map
