export declare const confluxESpace: import('../../types/utils.js').Assign<
	{
		readonly id: 1030
		readonly name: 'Conflux eSpace'
		readonly network: 'cfx-espace'
		readonly nativeCurrency: {
			readonly name: 'Conflux'
			readonly symbol: 'CFX'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://evm.confluxrpc.org']
			}
			readonly public: {
				readonly http: readonly ['https://evm.confluxrpc.org']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'ConfluxScan'
				readonly url: 'https://evm.confluxscan.io'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xEFf0078910f638cd81996cc117bccD3eDf2B072F'
				readonly blockCreated: 68602935
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=confluxESpace.d.ts.map
