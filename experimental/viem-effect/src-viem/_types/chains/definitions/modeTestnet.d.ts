export declare const modeTestnet: import('../../types/utils.js').Assign<
	{
		readonly id: 919
		readonly name: 'Mode Testnet'
		readonly network: 'mode-testnet'
		readonly nativeCurrency: {
			readonly name: 'Ether'
			readonly symbol: 'ETH'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://sepolia.mode.network']
			}
			readonly public: {
				readonly http: readonly ['https://sepolia.mode.network']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Blockscout'
				readonly url: 'https://sepolia.explorer.mode.network'
			}
		}
		readonly testnet: true
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=modeTestnet.d.ts.map
