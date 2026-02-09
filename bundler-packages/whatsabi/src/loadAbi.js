import { loaders, whatsabi } from '@shazow/whatsabi'

/**
 * @param {object} options
 * @param {import('@tevm/utils').Address} options.address
 * @param {import('viem').Client} options.client
 * @param {string | undefined} options.explorerUrl
 * @param {boolean} options.followProxies
 * @param {string | undefined} options.etherscanApiKey
 * @returns {ReturnType<typeof import('@shazow/whatsabi').autoload>}
 */
export const loadAbi = async ({ address, client, explorerUrl, followProxies, etherscanApiKey }) => {
	const chainId = client.chain?.id ?? 1
	return whatsabi.autoload(address, {
		provider: client,
		followProxies,
		abiLoader: new loaders.MultiABILoader([
			new loaders.SourcifyABILoader({
				chainId,
			}),
			...(etherscanApiKey !== undefined
				? [
						new loaders.EtherscanABILoader({
							apiKey: etherscanApiKey,
							chainId,
						}),
					]
				: explorerUrl !== undefined
					? [
							new loaders.EtherscanV1ABILoader({
								baseURL: explorerUrl,
								...(etherscanApiKey !== undefined ? { apiKey: etherscanApiKey } : {}),
							}),
						]
					: []),
		]),
	})
}
