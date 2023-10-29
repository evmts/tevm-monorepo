export declare const eosTestnet: import('../../types/utils.js').Assign<
	{
		readonly id: 15557
		readonly name: 'EOS EVM Testnet'
		readonly network: 'eos'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'EOS'
			readonly symbol: 'EOS'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://api.testnet.evm.eosnetwork.com']
			}
			readonly public: {
				readonly http: readonly ['https://api.testnet.evm.eosnetwork.com']
			}
		}
		readonly blockExplorers: {
			readonly etherscan: {
				readonly name: 'EOS EVM Testnet Explorer'
				readonly url: 'https://explorer.testnet.evm.eosnetwork.com'
			}
			readonly default: {
				readonly name: 'EOS EVM Testnet Explorer'
				readonly url: 'https://explorer.testnet.evm.eosnetwork.com'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xca11bde05977b3631167028862be2a173976ca11'
				readonly blockCreated: 9067940
			}
		}
		readonly testnet: true
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=eosTestnet.d.ts.map
