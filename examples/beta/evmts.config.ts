import packageJson from './package.json'
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
			addresses: {
				/*
anBaseUris: Record<number, string> = {
		1: 'https://etherscan.io',
		5: 'https://goerli.etherscan.io',
		10: 'https://optimistic.etherscan.io',
		56: 'https://bscscan.com',
		137: 'https://polygonscan.com',
		250: 'https://ftmscan.com',
		280: 'https://zksync2-mainnet.zkscan.io',
		288: 'https://bobascan.com',
		324: 'https://zksync2-mainnet.zkscan.io',
		420: 'https://goerli-explorer.optimism.io',
		1284: 'https://moonscan.io',
		4002: 'https://testnet.ftmscan.com',
		43114: 'https://explorer.avax.network',
		42220: 'https://celoscan.io',
		42161: 'https://arbiscan.io',
		80001: 'https://mumbai.polygonscan.com',
		84531: 'https://goerli.basescan.org',
		421613: 'https://goerli-rollup-explorer.arbitrum.io',
		534353: 'htt
				*/
				1: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
				5: '0x1df10ec981ac5871240be4a94f250dd238b77901',
				10: '0x1df10ec981ac5871240be4a94f250dd238b77901',
				56: '0x1df10ec981ac5871240be4a94f250dd238b77901',
				137: '0x1df10ec981ac5871240be4a94f250dd238b77901',
				250: '0x1df10ec981ac5871240be4a94f250dd238b77901',
				288: '0x1df10ec981ac5871240be4a94f250dd238b77901',
				324: '0x1df10ec981ac5871240be4a94f250dd238b77901',
				420: '0x1df10ec981ac5871240be4a94f250dd238b77901',
				42161: '0x1df10ec981ac5871240be4a94f250dd238b77901',
				80001: '0x1df10ec981ac5871240be4a94f250dd238b77901',
				421613: '0x1df10ec981ac5871240be4a94f250dd238b77901',
			},
		},
	],
	/**
	 * Keep this in sync with package.json and foundry.toml
	 */
	solcVersion: packageJson.devDependencies.solc,
}))
