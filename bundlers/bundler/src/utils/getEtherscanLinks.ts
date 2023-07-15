export const getEtherscanLinks = (
	addresses: Record<number, `0x${string}` | undefined>,
): [chainId: number, link: string][] => {
	const etherscanBaseUris: Record<number, string> = {
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
		534353: 'https://blockscout.scroll.io',
	}

	return Object.entries(addresses)
		.map(([networkId, address]) => {
			const link =
				etherscanBaseUris[networkId as unknown as number] &&
				`${
					etherscanBaseUris[networkId as unknown as number]
				}/address/${address}`
			return link && [networkId, link]
		})
		.filter(Boolean) as [number, string][]
}
