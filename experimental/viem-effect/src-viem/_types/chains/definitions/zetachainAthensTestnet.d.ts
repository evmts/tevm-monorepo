export declare const zetachainAthensTestnet: import('../../types/utils.js').Assign<
	{
		readonly id: 7001
		readonly name: 'ZetaChain Athens Testnet'
		readonly network: 'zetachain-athens-testnet'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'Zeta'
			readonly symbol: 'aZETA'
		}
		readonly rpcUrls: {
			readonly public: {
				readonly http: readonly [
					'https://zetachain-athens-evm.blockpi.network/v1/rpc/public',
				]
			}
			readonly default: {
				readonly http: readonly [
					'https://zetachain-athens-evm.blockpi.network/v1/rpc/public',
				]
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'ZetaScan'
				readonly url: 'https://athens3.explorer.zetachain.com'
			}
		}
		readonly testnet: true
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=zetachainAthensTestnet.d.ts.map
