import { getAddress } from '@tevm/utils'
import { contractUriPattern } from './contractUriPattern.js'

/**
 * @param {import('./ContractUri.js').ContractUri} uri
 * @returns {import('./ParsedUri.js').ParsedUri | undefined}
 */
export const parseUri = (uri) => {
	const match = contractUriPattern.exec(uri)
	if (!match) {
		return undefined
	}

	const chainId = Number.parseInt(match.groups?.['chainId'] ?? '1', 10)
	const address = getAddress(/** @type {string}*/ (match.groups?.['address']))
	const query = match.groups?.['query']

	const params = new URLSearchParams(query || '')

	return {
		chainId: /** @type {import('./KnownChainIds.js').KnownChainIds}*/ (chainId),
		address: address,
		rpcUrl: params.get('rpcUrl') || undefined,
		etherscanApiKey: params.get('etherscanApiKey') || undefined,
		etherscanBaseUrl: params.get('etherscanBaseUrl') || undefined,
		followProxies: params.get('followProxies') === 'true' || undefined,
	}
}
