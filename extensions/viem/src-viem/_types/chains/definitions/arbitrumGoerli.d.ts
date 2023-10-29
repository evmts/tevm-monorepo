export declare const arbitrumGoerli: import('../../types/utils.js').Assign<
	{
		readonly id: 421613
		readonly name: 'Arbitrum Goerli'
		readonly network: 'arbitrum-goerli'
		readonly nativeCurrency: {
			readonly name: 'Arbitrum Goerli Ether'
			readonly symbol: 'ETH'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly alchemy: {
				readonly http: readonly ['https://arb-goerli.g.alchemy.com/v2']
				readonly webSocket: readonly ['wss://arb-goerli.g.alchemy.com/v2']
			}
			readonly infura: {
				readonly http: readonly ['https://arbitrum-goerli.infura.io/v3']
				readonly webSocket: readonly ['wss://arbitrum-goerli.infura.io/ws/v3']
			}
			readonly default: {
				readonly http: readonly ['https://goerli-rollup.arbitrum.io/rpc']
			}
			readonly public: {
				readonly http: readonly ['https://goerli-rollup.arbitrum.io/rpc']
			}
		}
		readonly blockExplorers: {
			readonly etherscan: {
				readonly name: 'Arbiscan'
				readonly url: 'https://goerli.arbiscan.io/'
			}
			readonly default: {
				readonly name: 'Arbiscan'
				readonly url: 'https://goerli.arbiscan.io/'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xca11bde05977b3631167028862be2a173976ca11'
				readonly blockCreated: 88114
			}
		}
		readonly testnet: true
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=arbitrumGoerli.d.ts.map
