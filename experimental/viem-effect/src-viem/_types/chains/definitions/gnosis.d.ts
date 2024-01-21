export declare const gnosis: import('../../types/utils.js').Assign<
	{
		readonly id: 100
		readonly name: 'Gnosis'
		readonly network: 'gnosis'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'Gnosis'
			readonly symbol: 'xDAI'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://rpc.gnosischain.com']
			}
			readonly public: {
				readonly http: readonly ['https://rpc.gnosischain.com']
			}
		}
		readonly blockExplorers: {
			readonly etherscan: {
				readonly name: 'Gnosisscan'
				readonly url: 'https://gnosisscan.io'
			}
			readonly default: {
				readonly name: 'Gnosis Chain Explorer'
				readonly url: 'https://blockscout.com/xdai/mainnet'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xca11bde05977b3631167028862be2a173976ca11'
				readonly blockCreated: 21022491
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=gnosis.d.ts.map
