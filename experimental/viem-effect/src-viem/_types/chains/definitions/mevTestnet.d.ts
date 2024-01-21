export declare const mevTestnet: import('../../types/utils.js').Assign<
	{
		readonly id: 4759
		readonly network: 'MEVerse Testnet'
		readonly name: 'MEVerse Chain Testnet'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'MEVerse'
			readonly symbol: 'MEV'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://rpc.meversetestnet.io']
			}
			readonly public: {
				readonly http: readonly ['https://rpc.meversetestnet.io']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Explorer'
				readonly url: 'https://testnet.meversescan.io/'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xca11bde05977b3631167028862be2a173976ca11'
				readonly blockCreated: 64371115
			}
		}
		readonly testnet: true
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=mevTestnet.d.ts.map
