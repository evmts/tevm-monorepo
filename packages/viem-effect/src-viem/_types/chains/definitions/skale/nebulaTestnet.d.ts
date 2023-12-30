export declare const skaleNebulaTestnet: import('../../../types/utils.js').Assign<
	{
		readonly id: 503129905
		readonly name: 'SKALE | Nebula Gaming Hub Testnet'
		readonly network: 'skale-nebula-testnet'
		readonly nativeCurrency: {
			readonly name: 'sFUEL'
			readonly symbol: 'sFUEL'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly [
					'https://staging-v3.skalenodes.com/v1/staging-faint-slimy-achird',
				]
				readonly webSocket: readonly [
					'wss://staging-v3.skalenodes.com/v1/ws/staging-faint-slimy-achird',
				]
			}
			readonly public: {
				readonly http: readonly [
					'https://staging-v3.skalenodes.com/v1/staging-faint-slimy-achird',
				]
				readonly webSocket: readonly [
					'wss://staging-v3.skalenodes.com/v1/ws/staging-faint-slimy-achird',
				]
			}
		}
		readonly blockExplorers: {
			readonly blockscout: {
				readonly name: 'SKALE Explorer'
				readonly url: 'https://staging-faint-slimy-achird.explorer.staging-v3.skalenodes.com'
			}
			readonly default: {
				readonly name: 'SKALE Explorer'
				readonly url: 'https://staging-faint-slimy-achird.explorer.staging-v3.skalenodes.com'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xcA11bde05977b3631167028862bE2a173976CA11'
				readonly blockCreated: 2205882
			}
		}
		readonly testnet: true
	},
	import('../../../types/chain.js').ChainConfig<
		import('../../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=nebulaTestnet.d.ts.map
