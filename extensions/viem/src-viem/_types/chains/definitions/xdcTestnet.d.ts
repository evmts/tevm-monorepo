export declare const xdcTestnet: import('../../types/utils.js').Assign<
	{
		readonly id: 51
		readonly name: 'Apothem Network'
		readonly network: 'xdc-testnet'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'TXDC'
			readonly symbol: 'TXDC'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://erpc.apothem.network']
			}
			readonly public: {
				readonly http: readonly ['https://erpc.apothem.network']
			}
		}
		readonly blockExplorers: {
			readonly xinfin: {
				readonly name: 'XinFin'
				readonly url: 'https://explorer.apothem.network'
			}
			readonly default: {
				readonly name: 'Blocksscan'
				readonly url: 'https://apothem.blocksscan.io'
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=xdcTestnet.d.ts.map
