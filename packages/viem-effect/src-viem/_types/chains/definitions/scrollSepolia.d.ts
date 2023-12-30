export declare const scrollSepolia: import('../../types/utils.js').Assign<
	{
		readonly id: 534351
		readonly name: 'Scroll Sepolia'
		readonly network: 'scroll-sepolia'
		readonly nativeCurrency: {
			readonly name: 'Ether'
			readonly symbol: 'ETH'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://sepolia-rpc.scroll.io']
				readonly webSocket: readonly ['wss://sepolia-rpc.scroll.io/ws']
			}
			readonly public: {
				readonly http: readonly ['https://sepolia-rpc.scroll.io']
				readonly webSocket: readonly ['wss://sepolia-rpc.scroll.io/ws']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Blockscout'
				readonly url: 'https://sepolia-blockscout.scroll.io'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xca11bde05977b3631167028862be2a173976ca11'
				readonly blockCreated: 9473
			}
		}
		readonly testnet: true
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=scrollSepolia.d.ts.map
