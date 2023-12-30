export declare const klaytn: import('../../types/utils.js').Assign<
	{
		readonly id: 8217
		readonly name: 'Klaytn'
		readonly network: 'klaytn'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'Klaytn'
			readonly symbol: 'KLAY'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://cypress.fautor.app/archive']
			}
			readonly public: {
				readonly http: readonly ['https://cypress.fautor.app/archive']
			}
		}
		readonly blockExplorers: {
			readonly etherscan: {
				readonly name: 'KlaytnScope'
				readonly url: 'https://scope.klaytn.com'
			}
			readonly default: {
				readonly name: 'KlaytnScope'
				readonly url: 'https://scope.klaytn.com'
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=klaytn.d.ts.map
