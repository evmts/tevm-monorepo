export declare const mantleTestnet: import('../../types/utils.js').Assign<
	{
		readonly id: 5001
		readonly name: 'Mantle Testnet'
		readonly network: 'mantle'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'MNT'
			readonly symbol: 'MNT'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://rpc.testnet.mantle.xyz']
			}
			readonly public: {
				readonly http: readonly ['https://rpc.testnet.mantle.xyz']
			}
		}
		readonly blockExplorers: {
			readonly etherscan: {
				readonly name: 'Mantle Testnet Explorer'
				readonly url: 'https://explorer.testnet.mantle.xyz'
			}
			readonly default: {
				readonly name: 'Mantle Testnet Explorer'
				readonly url: 'https://explorer.testnet.mantle.xyz'
			}
		}
		readonly testnet: true
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=mantleTestnet.d.ts.map
