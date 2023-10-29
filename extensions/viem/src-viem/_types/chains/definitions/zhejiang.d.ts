export declare const zhejiang: import('../../types/utils.js').Assign<
	{
		readonly id: 1337803
		readonly network: 'zhejiang'
		readonly name: 'Zhejiang'
		readonly nativeCurrency: {
			readonly name: 'Zhejiang Ether'
			readonly symbol: 'ZhejETH'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://rpc.zhejiang.ethpandaops.io']
			}
			readonly public: {
				readonly http: readonly ['https://rpc.zhejiang.ethpandaops.io']
			}
		}
		readonly blockExplorers: {
			readonly beaconchain: {
				readonly name: 'Etherscan'
				readonly url: 'https://zhejiang.beaconcha.in'
			}
			readonly blockscout: {
				readonly name: 'Blockscout'
				readonly url: 'https://blockscout.com/eth/zhejiang-testnet'
			}
			readonly default: {
				readonly name: 'Beaconchain'
				readonly url: 'https://zhejiang.beaconcha.in'
			}
		}
		readonly testnet: true
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=zhejiang.d.ts.map
