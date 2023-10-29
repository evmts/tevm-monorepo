export declare const thunderTestnet: import('../../types/utils.js').Assign<
	{
		readonly id: 997
		readonly name: '5ireChain Thunder Testnet'
		readonly network: '5ireChain'
		readonly nativeCurrency: {
			readonly name: '5ire Token'
			readonly symbol: '5IRE'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://rpc-testnet.5ire.network']
			}
			readonly public: {
				readonly http: readonly ['https://rpc-testnet.5ire.network']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: '5ireChain Explorer'
				readonly url: 'https://explorer.5ire.network'
			}
		}
		readonly testnet: true
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=thunderTestnet.d.ts.map
