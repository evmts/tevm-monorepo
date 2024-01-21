export declare const xdc: import('../../types/utils.js').Assign<
	{
		readonly id: 50
		readonly name: 'XinFin Network'
		readonly network: 'xdc'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'XDC'
			readonly symbol: 'XDC'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://rpc.xinfin.network']
			}
			readonly public: {
				readonly http: readonly ['https://rpc.xinfin.network']
			}
		}
		readonly blockExplorers: {
			readonly xinfin: {
				readonly name: 'XinFin'
				readonly url: 'https://explorer.xinfin.network'
			}
			readonly default: {
				readonly name: 'Blocksscan'
				readonly url: 'https://xdc.blocksscan.io'
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=xdc.d.ts.map
