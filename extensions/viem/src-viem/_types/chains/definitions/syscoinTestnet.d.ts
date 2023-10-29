export declare const syscoinTestnet: import('../../types/utils.js').Assign<
	{
		readonly id: 5700
		readonly name: 'Syscoin Tanenbaum Testnet'
		readonly network: 'syscoin-testnet'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'Syscoin'
			readonly symbol: 'SYS'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://rpc.tanenbaum.io']
				readonly webSocket: readonly ['wss://rpc.tanenbaum.io/wss']
			}
			readonly public: {
				readonly http: readonly ['https://rpc.tanenbaum.io']
				readonly webSocket: readonly ['wss://rpc.tanenbaum.io/wss']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'SyscoinTestnetExplorer'
				readonly url: 'https://tanenbaum.io'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xcA11bde05977b3631167028862bE2a173976CA11'
				readonly blockCreated: 271288
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=syscoinTestnet.d.ts.map
