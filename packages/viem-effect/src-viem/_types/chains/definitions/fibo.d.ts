export declare const fibo: import('../../types/utils.js').Assign<
	{
		readonly id: 12306
		readonly name: 'Fibo Chain'
		readonly network: 'fibochain'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'fibo'
			readonly symbol: 'FIBO'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://network.hzroc.art']
			}
			readonly public: {
				readonly http: readonly ['https://network.hzroc.art']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'FiboScan'
				readonly url: 'https://scan.fibochain.org'
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=fibo.d.ts.map
