export declare const syscoin: import('../../types/utils.js').Assign<
	{
		readonly id: 57
		readonly name: 'Syscoin Mainnet'
		readonly network: 'syscoin'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'Syscoin'
			readonly symbol: 'SYS'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://rpc.syscoin.org']
				readonly webSocket: readonly ['wss://rpc.syscoin.org/wss']
			}
			readonly public: {
				readonly http: readonly ['https://rpc.syscoin.org']
				readonly webSocket: readonly ['wss://rpc.syscoin.org/wss']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'SyscoinExplorer'
				readonly url: 'https://explorer.syscoin.org'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xcA11bde05977b3631167028862bE2a173976CA11'
				readonly blockCreated: 287139
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=syscoin.d.ts.map
