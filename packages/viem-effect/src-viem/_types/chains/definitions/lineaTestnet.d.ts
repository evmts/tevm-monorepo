export declare const lineaTestnet: import('../../types/utils.js').Assign<
	{
		readonly id: 59140
		readonly name: 'Linea Goerli Testnet'
		readonly network: 'linea-testnet'
		readonly nativeCurrency: {
			readonly name: 'Linea Ether'
			readonly symbol: 'ETH'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly infura: {
				readonly http: readonly ['https://linea-goerli.infura.io/v3']
				readonly webSocket: readonly ['wss://linea-goerli.infura.io/ws/v3']
			}
			readonly default: {
				readonly http: readonly ['https://rpc.goerli.linea.build']
				readonly webSocket: readonly ['wss://rpc.goerli.linea.build']
			}
			readonly public: {
				readonly http: readonly ['https://rpc.goerli.linea.build']
				readonly webSocket: readonly ['wss://rpc.goerli.linea.build']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Etherscan'
				readonly url: 'https://goerli.lineascan.build'
			}
			readonly etherscan: {
				readonly name: 'Etherscan'
				readonly url: 'https://goerli.lineascan.build'
			}
			readonly blockscout: {
				readonly name: 'Blockscout'
				readonly url: 'https://explorer.goerli.linea.build'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xca11bde05977b3631167028862be2a173976ca11'
				readonly blockCreated: 498623
			}
		}
		readonly testnet: true
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=lineaTestnet.d.ts.map
