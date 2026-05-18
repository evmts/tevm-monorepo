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
	return whatsabi.autoload(address, {
		provider: client,
		followProxies,
		abiLoader: new loaders.MultiABILoader([
			new loaders.SourcifyABILoader({
				chainId: client.chain?.id ?? 1,
			}),
			...(explorerUrl !== undefined
				? [
						new loaders.EtherscanABILoader({
							baseURL: explorerUrl,
							...(etherscanApiKey !== undefined ? { apiKey: etherscanApiKey } : {}),
						}),
					]
				: []),
		]),
	})
}
