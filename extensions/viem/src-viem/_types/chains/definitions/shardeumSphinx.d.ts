export declare const shardeumSphinx: import('../../types/utils.js').Assign<
	{
		readonly id: 8082
		readonly name: 'Shardeum Sphinx'
		readonly network: 'shmSphinx'
		readonly nativeCurrency: {
			readonly name: 'SHARDEUM'
			readonly symbol: 'SHM'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://sphinx.shardeum.org']
			}
			readonly public: {
				readonly http: readonly ['https://sphinx.shardeum.org']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Shardeum Explorer'
				readonly url: 'https://explorer-sphinx.shardeum.org'
			}
		}
		readonly testnet: true
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=shardeumSphinx.d.ts.map
