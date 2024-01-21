export declare const wanchainTestnet: import('../../types/utils.js').Assign<
	{
		readonly id: 999
		readonly name: 'Wanchain Testnet'
		readonly network: 'wanchainTestnet'
		readonly nativeCurrency: {
			readonly name: 'WANCHAIN'
			readonly symbol: 'WANt'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://gwan-ssl.wandevs.org:46891']
			}
			readonly public: {
				readonly http: readonly ['https://gwan-ssl.wandevs.org:46891']
			}
		}
		readonly blockExplorers: {
			readonly etherscan: {
				readonly name: 'WanScanTest'
				readonly url: 'https://wanscan.org'
			}
			readonly default: {
				readonly name: 'WanScanTest'
				readonly url: 'https://wanscan.org'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0x11c89bF4496c39FB80535Ffb4c92715839CC5324'
				readonly blockCreated: 24743448
			}
		}
		readonly testnet: true
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=wanchainTestnet.d.ts.map
