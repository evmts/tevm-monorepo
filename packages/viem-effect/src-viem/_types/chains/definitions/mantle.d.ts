export declare const mantle: import('../../types/utils.js').Assign<
	{
		readonly id: 5000
		readonly name: 'Mantle'
		readonly network: 'mantle'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'MNT'
			readonly symbol: 'MNT'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://rpc.mantle.xyz']
			}
			readonly public: {
				readonly http: readonly ['https://rpc.mantle.xyz']
			}
		}
		readonly blockExplorers: {
			readonly etherscan: {
				readonly name: 'Mantle Explorer'
				readonly url: 'https://explorer.mantle.xyz'
			}
			readonly default: {
				readonly name: 'Mantle Explorer'
				readonly url: 'https://explorer.mantle.xyz'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xcA11bde05977b3631167028862bE2a173976CA11'
				readonly blockCreated: 304717
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=mantle.d.ts.map
