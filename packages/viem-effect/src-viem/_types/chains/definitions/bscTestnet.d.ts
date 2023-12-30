export declare const bscTestnet: import('../../types/utils.js').Assign<
	{
		readonly id: 97
		readonly name: 'Binance Smart Chain Testnet'
		readonly network: 'bsc-testnet'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'BNB'
			readonly symbol: 'tBNB'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly [
					'https://data-seed-prebsc-1-s1.binance.org:8545',
				]
			}
			readonly public: {
				readonly http: readonly [
					'https://data-seed-prebsc-1-s1.binance.org:8545',
				]
			}
		}
		readonly blockExplorers: {
			readonly etherscan: {
				readonly name: 'BscScan'
				readonly url: 'https://testnet.bscscan.com'
			}
			readonly default: {
				readonly name: 'BscScan'
				readonly url: 'https://testnet.bscscan.com'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xca11bde05977b3631167028862be2a173976ca11'
				readonly blockCreated: 17422483
			}
		}
		readonly testnet: true
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=bscTestnet.d.ts.map
