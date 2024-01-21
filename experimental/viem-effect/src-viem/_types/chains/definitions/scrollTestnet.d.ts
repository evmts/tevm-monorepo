export declare const scrollTestnet: import('../../types/utils.js').Assign<
	{
		readonly id: 534353
		readonly name: 'Scroll Testnet'
		readonly network: 'scroll-testnet'
		readonly nativeCurrency: {
			readonly name: 'Ether'
			readonly symbol: 'ETH'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://alpha-rpc.scroll.io/l2']
				readonly webSocket: readonly ['wss://alpha-rpc.scroll.io/l2/ws']
			}
			readonly public: {
				readonly http: readonly ['https://alpha-rpc.scroll.io/l2']
				readonly webSocket: readonly ['wss://alpha-rpc.scroll.io/l2/ws']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Blockscout'
				readonly url: 'https://blockscout.scroll.io'
			}
		}
		readonly testnet: true
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=scrollTestnet.d.ts.map
