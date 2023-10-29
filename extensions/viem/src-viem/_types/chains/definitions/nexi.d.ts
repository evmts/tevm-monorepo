export declare const nexi: import('../../types/utils.js').Assign<
	{
		readonly id: 4242
		readonly name: 'Nexi'
		readonly network: 'nexi'
		readonly nativeCurrency: {
			readonly name: 'Nexi'
			readonly symbol: 'NEXI'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://rpc.chain.nexi.technology']
			}
			readonly public: {
				readonly http: readonly ['https://rpc.chain.nexi.technology']
			}
		}
		readonly blockExplorers: {
			readonly etherscan: {
				readonly name: 'NexiScan'
				readonly url: 'https://www.nexiscan.com'
			}
			readonly default: {
				readonly name: 'NexiScan'
				readonly url: 'https://www.nexiscan.com'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0x0277A46Cc69A57eE3A6C8c158bA874832F718B8E'
				readonly blockCreated: 25770160
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=nexi.d.ts.map
