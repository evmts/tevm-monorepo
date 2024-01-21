export declare const zkSync: import('../../types/utils.js').Assign<
	{
		readonly id: 324
		readonly name: 'zkSync Era'
		readonly network: 'zksync-era'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'Ether'
			readonly symbol: 'ETH'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://mainnet.era.zksync.io']
				readonly webSocket: readonly ['wss://mainnet.era.zksync.io/ws']
			}
			readonly public: {
				readonly http: readonly ['https://mainnet.era.zksync.io']
				readonly webSocket: readonly ['wss://mainnet.era.zksync.io/ws']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'zkExplorer'
				readonly url: 'https://explorer.zksync.io'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xF9cda624FBC7e059355ce98a31693d299FACd963'
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=zkSync.d.ts.map
