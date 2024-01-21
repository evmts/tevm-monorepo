export declare const telos: import('../../types/utils.js').Assign<
	{
		readonly id: 40
		readonly name: 'Telos'
		readonly network: 'telos'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'Telos'
			readonly symbol: 'TLOS'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://mainnet.telos.net/evm']
			}
			readonly public: {
				readonly http: readonly ['https://mainnet.telos.net/evm']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Teloscan'
				readonly url: 'https://www.teloscan.io/'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xcA11bde05977b3631167028862bE2a173976CA11'
				readonly blockCreated: 246530709
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=telos.d.ts.map
