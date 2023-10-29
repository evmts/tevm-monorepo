export declare const dfk: import('../../types/utils.js').Assign<
	{
		readonly id: 53935
		readonly name: 'DFK Chain'
		readonly network: 'dfk'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'Jewel'
			readonly symbol: 'JEWEL'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly [
					'https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc',
				]
			}
			readonly public: {
				readonly http: readonly [
					'https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc',
				]
			}
		}
		readonly blockExplorers: {
			readonly etherscan: {
				readonly name: 'DFKSubnetScan'
				readonly url: 'https://subnets.avax.network/defi-kingdoms'
			}
			readonly default: {
				readonly name: 'DFKSubnetScan'
				readonly url: 'https://subnets.avax.network/defi-kingdoms'
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=dfk.d.ts.map
