export declare const mainnet: import('../../types/utils.js').Assign<
	{
		readonly id: 1
		readonly network: 'homestead'
		readonly name: 'Ethereum'
		readonly nativeCurrency: {
			readonly name: 'Ether'
			readonly symbol: 'ETH'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly alchemy: {
				readonly http: readonly ['https://eth-mainnet.g.alchemy.com/v2']
				readonly webSocket: readonly ['wss://eth-mainnet.g.alchemy.com/v2']
			}
			readonly infura: {
				readonly http: readonly ['https://mainnet.infura.io/v3']
				readonly webSocket: readonly ['wss://mainnet.infura.io/ws/v3']
			}
			readonly default: {
				readonly http: readonly ['https://cloudflare-eth.com']
			}
			readonly public: {
				readonly http: readonly ['https://cloudflare-eth.com']
			}
		}
		readonly blockExplorers: {
			readonly etherscan: {
				readonly name: 'Etherscan'
				readonly url: 'https://etherscan.io'
			}
			readonly default: {
				readonly name: 'Etherscan'
				readonly url: 'https://etherscan.io'
			}
		}
		readonly contracts: {
			readonly ensRegistry: {
				readonly address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
			}
			readonly ensUniversalResolver: {
				readonly address: '0xc0497E381f536Be9ce14B0dD3817cBcAe57d2F62'
				readonly blockCreated: 16966585
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
//# sourceMappingURL=mainnet.d.ts.map
