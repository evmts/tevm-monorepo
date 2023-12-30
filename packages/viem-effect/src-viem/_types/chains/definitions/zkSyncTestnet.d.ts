export declare const zkSyncTestnet: import('../../types/utils.js').Assign<
	{
		readonly id: 280
		readonly name: 'zkSync Era Testnet'
		readonly network: 'zksync-era-testnet'
		readonly nativeCurrency: {
			readonly name: 'Ether'
			readonly symbol: 'ETH'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://testnet.era.zksync.dev']
				readonly webSocket: readonly ['wss://testnet.era.zksync.dev/ws']
			}
			readonly public: {
				readonly http: readonly ['https://testnet.era.zksync.dev']
				readonly webSocket: readonly ['wss://testnet.era.zksync.dev/ws']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'zkExplorer'
				readonly url: 'https://goerli.explorer.zksync.io'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xF9cda624FBC7e059355ce98a31693d299FACd963'
			}
		}
		readonly testnet: true
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=zkSyncTestnet.d.ts.map
