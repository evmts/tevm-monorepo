export declare const dogechain: import('../../types/utils.js').Assign<
	{
		readonly id: 2000
		readonly name: 'Dogechain'
		readonly network: 'dogechain'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'Dogechain'
			readonly symbol: 'DC'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://rpc.dogechain.dog']
			}
			readonly public: {
				readonly http: readonly ['https://rpc.dogechain.dog']
			}
		}
		readonly blockExplorers: {
			readonly etherscan: {
				readonly name: 'DogeChainExplorer'
				readonly url: 'https://explorer.dogechain.dog'
			}
			readonly default: {
				readonly name: 'DogeChainExplorer'
				readonly url: 'https://explorer.dogechain.dog'
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=dogechain.d.ts.map
