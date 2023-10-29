export declare const polygon: import('../../types/utils.js').Assign<
	{
		readonly id: 137
		readonly name: 'Polygon'
		readonly network: 'matic'
		readonly nativeCurrency: {
			readonly name: 'MATIC'
			readonly symbol: 'MATIC'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly alchemy: {
				readonly http: readonly ['https://polygon-mainnet.g.alchemy.com/v2']
				readonly webSocket: readonly ['wss://polygon-mainnet.g.alchemy.com/v2']
			}
			readonly infura: {
				readonly http: readonly ['https://polygon-mainnet.infura.io/v3']
				readonly webSocket: readonly ['wss://polygon-mainnet.infura.io/ws/v3']
			}
			readonly default: {
				readonly http: readonly ['https://polygon-rpc.com']
			}
			readonly public: {
				readonly http: readonly ['https://polygon-rpc.com']
			}
		}
		readonly blockExplorers: {
			readonly etherscan: {
				readonly name: 'PolygonScan'
				readonly url: 'https://polygonscan.com'
			}
			readonly default: {
				readonly name: 'PolygonScan'
				readonly url: 'https://polygonscan.com'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xca11bde05977b3631167028862be2a173976ca11'
				readonly blockCreated: 25770160
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=polygon.d.ts.map
