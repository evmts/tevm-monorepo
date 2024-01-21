export declare const foundry: import('../../types/utils.js').Assign<
	{
		readonly id: 31337
		readonly name: 'Foundry'
		readonly network: 'foundry'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'Ether'
			readonly symbol: 'ETH'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['http://127.0.0.1:8545']
				readonly webSocket: readonly ['ws://127.0.0.1:8545']
			}
			readonly public: {
				readonly http: readonly ['http://127.0.0.1:8545']
				readonly webSocket: readonly ['ws://127.0.0.1:8545']
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=foundry.d.ts.map
