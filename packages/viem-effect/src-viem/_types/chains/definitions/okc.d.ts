export declare const okc: import('../../types/utils.js').Assign<
	{
		readonly id: 66
		readonly name: 'OKC'
		readonly network: 'okc'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'OKT'
			readonly symbol: 'OKT'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://exchainrpc.okex.org']
			}
			readonly public: {
				readonly http: readonly ['https://exchainrpc.okex.org']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'oklink'
				readonly url: 'https://www.oklink.com/okc'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xca11bde05977b3631167028862be2a173976ca11'
				readonly blockCreated: 10364792
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=okc.d.ts.map
