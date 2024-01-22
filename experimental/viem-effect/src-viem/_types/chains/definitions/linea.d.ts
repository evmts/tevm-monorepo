export declare const linea: import('../../types/utils.js').Assign<
	{
		readonly id: 59144
		readonly name: 'Linea Mainnet'
		readonly network: 'linea-mainnet'
		readonly nativeCurrency: {
			readonly name: 'Linea Ether'
			readonly symbol: 'ETH'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly infura: {
				readonly http: readonly ['https://linea-mainnet.infura.io/v3']
				readonly webSocket: readonly ['wss://linea-mainnet.infura.io/ws/v3']
			}
			readonly default: {
				readonly http: readonly ['https://rpc.linea.build']
				readonly webSocket: readonly ['wss://rpc.linea.build']
			}
			readonly public: {
				readonly http: readonly ['https://rpc.linea.build']
				readonly webSocket: readonly ['wss://rpc.linea.build']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Etherscan'
				readonly url: 'https://lineascan.build'
			}
			readonly etherscan: {
				readonly name: 'Etherscan'
				readonly url: 'https://lineascan.build'
			}
			readonly blockscout: {
				readonly name: 'Blockscout'
				readonly url: 'https://explorer.linea.build'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xcA11bde05977b3631167028862bE2a173976CA11'
				readonly blockCreated: 42
			}
		}
		readonly testnet: false
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=linea.d.ts.map
