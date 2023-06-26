import { defineConfig } from '@evmts/config'

/**
 * @see https://evmts.dev/reference/config.html
 */
export default defineConfig(() => ({
	/**
	 * Deployments allow evmts to configure default addresses for different networks
	 */
	deployments: [
		{
			name: 'WagmiMintExample',
			addresses: { 1: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2' } ,
		},
	],
	/**
	 * Keep this in sync with package.json and foundry.toml
	 */
	solcVersion: '0.8.20',
}))
