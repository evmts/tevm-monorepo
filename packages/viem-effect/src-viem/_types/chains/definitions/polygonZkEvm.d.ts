export declare const polygonZkEvm: import('../../types/utils.js').Assign<
	{
		readonly id: 1101
		readonly name: 'Polygon zkEVM'
		readonly network: 'polygon-zkevm'
		readonly nativeCurrency: {
			readonly name: 'Ether'
			readonly symbol: 'ETH'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://zkevm-rpc.com']
			}
			readonly public: {
				readonly http: readonly ['https://zkevm-rpc.com']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'PolygonScan'
				readonly url: 'https://zkevm.polygonscan.com'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xca11bde05977b3631167028862be2a173976ca11'
				readonly blockCreated: 57746
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=polygonZkEvm.d.ts.map
