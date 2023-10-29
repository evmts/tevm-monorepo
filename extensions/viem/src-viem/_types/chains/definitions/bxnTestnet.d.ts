export declare const bxnTestnet: import('../../types/utils.js').Assign<
	{
		readonly id: 4777
		readonly name: 'BlackFort Exchange Network Testnet'
		readonly network: 'bxnTestnet'
		readonly nativeCurrency: {
			readonly name: 'BlackFort Testnet Token'
			readonly symbol: 'TBXN'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://testnet.blackfort.network/rpc']
			}
			readonly public: {
				readonly http: readonly ['https://testnet.blackfort.network/rpc']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Blockscout'
				readonly url: 'https://testnet-explorer.blackfort.network'
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=bxnTestnet.d.ts.map
