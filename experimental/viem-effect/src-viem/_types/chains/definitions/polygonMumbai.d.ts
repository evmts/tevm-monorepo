export declare const polygonMumbai: import('../../types/utils.js').Assign<
	{
		readonly id: 80001
		readonly name: 'Polygon Mumbai'
		readonly network: 'maticmum'
		readonly nativeCurrency: {
			readonly name: 'MATIC'
			readonly symbol: 'MATIC'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly alchemy: {
				readonly http: readonly ['https://polygon-mumbai.g.alchemy.com/v2']
				readonly webSocket: readonly ['wss://polygon-mumbai.g.alchemy.com/v2']
			}
			readonly infura: {
				readonly http: readonly ['https://polygon-mumbai.infura.io/v3']
				readonly webSocket: readonly ['wss://polygon-mumbai.infura.io/ws/v3']
			}
			readonly default: {
				readonly http: readonly ['https://rpc.ankr.com/polygon_mumbai']
			}
			readonly public: {
				readonly http: readonly ['https://rpc.ankr.com/polygon_mumbai']
			}
		}
		readonly blockExplorers: {
			readonly etherscan: {
				readonly name: 'PolygonScan'
				readonly url: 'https://mumbai.polygonscan.com'
			}
			readonly default: {
				readonly name: 'PolygonScan'
				readonly url: 'https://mumbai.polygonscan.com'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xca11bde05977b3631167028862be2a173976ca11'
				readonly blockCreated: 25770160
			}
		}
		readonly testnet: true
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=polygonMumbai.d.ts.map
