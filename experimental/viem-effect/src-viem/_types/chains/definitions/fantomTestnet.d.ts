export declare const fantomTestnet: import('../../types/utils.js').Assign<
	{
		readonly id: 4002
		readonly name: 'Fantom Testnet'
		readonly network: 'fantom-testnet'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'Fantom'
			readonly symbol: 'FTM'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://rpc.testnet.fantom.network']
			}
			readonly public: {
				readonly http: readonly ['https://rpc.testnet.fantom.network']
			}
		}
		readonly blockExplorers: {
			readonly etherscan: {
				readonly name: 'FTMScan'
				readonly url: 'https://testnet.ftmscan.com'
			}
			readonly default: {
				readonly name: 'FTMScan'
				readonly url: 'https://testnet.ftmscan.com'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xca11bde05977b3631167028862be2a173976ca11'
				readonly blockCreated: 8328688
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=fantomTestnet.d.ts.map
