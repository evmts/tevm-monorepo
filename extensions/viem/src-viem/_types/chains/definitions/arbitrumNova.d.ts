export declare const arbitrumNova: import('../../types/utils.js').Assign<
	{
		readonly id: 42170
		readonly name: 'Arbitrum Nova'
		readonly network: 'arbitrum-nova'
		readonly nativeCurrency: {
			readonly name: 'Ether'
			readonly symbol: 'ETH'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly blast: {
				readonly http: readonly ['https://arbitrum-nova.public.blastapi.io']
				readonly webSocket: readonly ['wss://arbitrum-nova.public.blastapi.io']
			}
			readonly default: {
				readonly http: readonly ['https://nova.arbitrum.io/rpc']
			}
			readonly public: {
				readonly http: readonly ['https://nova.arbitrum.io/rpc']
			}
		}
		readonly blockExplorers: {
			readonly etherscan: {
				readonly name: 'Arbiscan'
				readonly url: 'https://nova.arbiscan.io'
			}
			readonly blockScout: {
				readonly name: 'BlockScout'
				readonly url: 'https://nova-explorer.arbitrum.io/'
			}
			readonly default: {
				readonly name: 'Arbiscan'
				readonly url: 'https://nova.arbiscan.io'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xca11bde05977b3631167028862be2a173976ca11'
				readonly blockCreated: 1746963
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=arbitrumNova.d.ts.map
