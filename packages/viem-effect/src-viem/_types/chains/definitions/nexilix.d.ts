export declare const nexilix: import('../../types/utils.js').Assign<
	{
		readonly id: 240
		readonly name: 'Nexilix Smart Chain'
		readonly network: 'nexilix'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'Nexilix'
			readonly symbol: 'NEXILIX'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://rpcurl.pos.nexilix.com']
			}
			readonly public: {
				readonly http: readonly ['https://rpcurl.pos.nexilix.com']
			}
		}
		readonly blockExplorers: {
			readonly etherscan: {
				readonly name: 'NexilixScan'
				readonly url: 'https://scan.nexilix.com'
			}
			readonly default: {
				readonly name: 'NexilixScan'
				readonly url: 'https://scan.nexilix.com'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0x58381c8e2BF9d0C2C4259cA14BdA9Afe02831244'
				readonly blockCreated: 74448
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=nexilix.d.ts.map
