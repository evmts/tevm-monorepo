export declare const pulsechainV4: import('../../types/utils.js').Assign<
	{
		readonly id: 943
		readonly network: 'pulsechainV4'
		readonly name: 'PulseChain V4'
		readonly testnet: true
		readonly nativeCurrency: {
			readonly name: 'V4 Pulse'
			readonly symbol: 'v4PLS'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://rpc.v4.testnet.pulsechain.com']
				readonly webSocket: readonly ['wss://ws.v4.testnet.pulsechain.com']
			}
			readonly public: {
				readonly http: readonly ['https://rpc.v4.testnet.pulsechain.com']
				readonly webSocket: readonly ['wss://ws.v4.testnet.pulsechain.com']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'PulseScan'
				readonly url: 'https://scan.v4.testnet.pulsechain.com'
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
//# sourceMappingURL=pulsechainV4.d.ts.map
