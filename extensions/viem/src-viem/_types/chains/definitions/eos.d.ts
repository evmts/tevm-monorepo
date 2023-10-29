export declare const eos: import('../../types/utils.js').Assign<
	{
		readonly id: 17777
		readonly name: 'EOS EVM'
		readonly network: 'eos'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'EOS'
			readonly symbol: 'EOS'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://api.evm.eosnetwork.com']
			}
			readonly public: {
				readonly http: readonly ['https://api.evm.eosnetwork.com']
			}
		}
		readonly blockExplorers: {
			readonly etherscan: {
				readonly name: 'EOS EVM Explorer'
				readonly url: 'https://explorer.evm.eosnetwork.com'
			}
			readonly default: {
				readonly name: 'EOS EVM Explorer'
				readonly url: 'https://explorer.evm.eosnetwork.com'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xca11bde05977b3631167028862be2a173976ca11'
				readonly blockCreated: 7943933
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=eos.d.ts.map
