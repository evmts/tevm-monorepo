export declare const polygonZkEvmTestnet: import('../../types/utils.js').Assign<
	{
		readonly id: 1442
		readonly name: 'Polygon zkEVM Testnet'
		readonly network: 'polygon-zkevm-testnet'
		readonly nativeCurrency: {
			readonly name: 'Ether'
			readonly symbol: 'ETH'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://rpc.public.zkevm-test.net']
			}
			readonly public: {
				readonly http: readonly ['https://rpc.public.zkevm-test.net']
			}
		}
		readonly blockExplorers: {
			readonly blockscout: {
				readonly name: 'Blockscout'
				readonly url: 'https://explorer.public.zkevm-test.net'
			}
			readonly default: {
				readonly name: 'PolygonScan'
				readonly url: 'https://testnet-zkevm.polygonscan.com'
			}
		}
		readonly testnet: true
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xca11bde05977b3631167028862be2a173976ca11'
				readonly blockCreated: 525686
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=polygonZkEvmTestnet.d.ts.map
