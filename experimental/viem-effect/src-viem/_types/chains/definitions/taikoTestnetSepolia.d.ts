export declare const taikoTestnetSepolia: import('../../types/utils.js').Assign<
	{
		readonly id: 167005
		readonly name: 'Taiko (Alpha-3 Testnet)'
		readonly network: 'taiko-sepolia'
		readonly nativeCurrency: {
			readonly name: 'Ether'
			readonly symbol: 'ETH'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://rpc.test.taiko.xyz']
			}
			readonly public: {
				readonly http: readonly ['https://rpc.test.taiko.xyz']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'blockscout'
				readonly url: 'https://explorer.test.taiko.xyz'
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=taikoTestnetSepolia.d.ts.map
