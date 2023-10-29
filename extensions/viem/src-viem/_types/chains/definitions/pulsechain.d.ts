export declare const pulsechain: import('../../types/utils.js').Assign<
	{
		readonly id: 369
		readonly network: 'pulsechain'
		readonly name: 'PulseChain'
		readonly nativeCurrency: {
			readonly name: 'Pulse'
			readonly symbol: 'PLS'
			readonly decimals: 18
		}
		readonly testnet: false
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://rpc.pulsechain.com']
				readonly webSocket: readonly ['wss://ws.pulsechain.com']
			}
			readonly public: {
				readonly http: readonly ['https://rpc.pulsechain.com']
				readonly webSocket: readonly ['wss://ws.pulsechain.com']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'PulseScan'
				readonly url: 'https://scan.pulsechain.com'
			}
		}
		readonly contracts: {
			readonly ensRegistry: {
				readonly address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
			}
			readonly multicall3: {
				readonly address: '0xca11bde05977b3631167028862be2a173976ca11'
				readonly blockCreated: 14353601
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=pulsechain.d.ts.map
