export declare const neonDevnet: import('../../types/utils.js').Assign<
	{
		readonly id: 245022926
		readonly network: 'neonDevnet'
		readonly name: 'Neon EVM DevNet'
		readonly nativeCurrency: {
			readonly name: 'NEON'
			readonly symbol: 'NEON'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://devnet.neonevm.org']
			}
			readonly public: {
				readonly http: readonly ['https://devnet.neonevm.org']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Neonscan'
				readonly url: 'https://neonscan.org'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xca11bde05977b3631167028862be2a173976ca11'
				readonly blockCreated: 205206112
			}
		}
		readonly testnet: true
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=neonDevnet.d.ts.map
