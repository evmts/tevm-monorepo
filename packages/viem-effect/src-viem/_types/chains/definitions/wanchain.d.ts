export declare const wanchain: import('../../types/utils.js').Assign<
	{
		readonly id: 888
		readonly name: 'Wanchain'
		readonly network: 'wanchain'
		readonly nativeCurrency: {
			readonly name: 'WANCHAIN'
			readonly symbol: 'WAN'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly [
					'https://gwan-ssl.wandevs.org:56891',
					'https://gwan2-ssl.wandevs.org',
				]
			}
			readonly public: {
				readonly http: readonly [
					'https://gwan-ssl.wandevs.org:56891',
					'https://gwan2-ssl.wandevs.org',
				]
			}
		}
		readonly blockExplorers: {
			readonly etherscan: {
				readonly name: 'WanScan'
				readonly url: 'https://wanscan.org'
			}
			readonly default: {
				readonly name: 'WanScan'
				readonly url: 'https://wanscan.org'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xcDF6A1566e78EB4594c86Fe73Fcdc82429e97fbB'
				readonly blockCreated: 25312390
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=wanchain.d.ts.map
