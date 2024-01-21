export declare const edgeware: import('../../types/utils.js').Assign<
	{
		readonly id: 2021
		readonly name: 'Edgeware EdgeEVM Mainnet'
		readonly network: 'edgeware'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'Edgeware'
			readonly symbol: 'EDG'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://edgeware-evm.jelliedowl.net']
			}
			readonly public: {
				readonly http: readonly ['https://edgeware-evm.jelliedowl.net']
			}
		}
		readonly blockExplorers: {
			readonly etherscan: {
				readonly name: 'Edgscan by Bharathcoorg'
				readonly url: 'https://edgscan.live'
			}
			readonly default: {
				readonly name: 'Edgscan by Bharathcoorg'
				readonly url: 'https://edgscan.live'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xca11bde05977b3631167028862be2a173976ca11'
				readonly blockCreated: 18117872
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=edgeware.d.ts.map
