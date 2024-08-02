import { loaders, whatsabi } from '@shazow/whatsabi'
import { http, createClient } from 'viem'
import { getCode } from 'viem/actions'
import { knownChains } from './knownChains.js'
import { parseUri } from './parseUri.js'

export class UnknownChainError extends Error {
	/**
	 * @type {'UnknownChainError'}
	 * @override
	 */
	name = 'UnknownChainError'
	/**
	 * @type {'UnknownChainError'}
	 */
	_tag = 'UnknownChainError'
	constructor(chainId) {
		super(
			`Unknown chain ID: ${chainId}. No default rpc known. Please pass in a valid rpc url as a query string \`?rpcUrl=${rpcUrl}\` or open a pr to viem to add your chain to viem/chains`,
		)
	}
}

// TODO pass in tevm config too
/**
 * @param {import('./ContractUri.js').ContractUri}
 * @returns { Promise<{abi: Abi, address: Address, deployedBytecode: import('viem').Hex} | undefined>}
 * @throws {UnknownChainError} if the chainId is not known and no rpcUrl is provided
 */
export const resolveWithWhatsabi = async (contractUri) => {
	const parsedUri = parseUri(contractUri)
	if (!parsedUri) {
		return undefined
	}
	const chain = knownChains[parsedUri.chainId]
	if (!chain && !parsedUri.rpcUrl) {
		throw new UnknownChainError(parsedUri.chainId)
	}
	const client = createClient({
		transport: http(parsedUri.rpcUrl),
		chain,
	})
	const explorerUrl = parsedUri.etherscanBaseUrl ?? chain.blockExplorers?.default.url
	const whatsabiResult = await whatsabi.autoload(parsedUri.address, {
		provider: client,
		followProxies: parsedUri.followProxies ?? true,
		abiLoader: new loaders.MultiABILoader([
			new loaders.SourcifyABILoader({
				chainId: chain.id,
			}),
			...(explorerUrl !== undefined
				? [
						new loaders.EtherscanABILoader({
							baseURL: explorerUrl,
							...(parsedUri.etherscanApiKey !== undefined ? { apiKey: parsedUri.etherscanApiKey } : {}),
						}),
					]
				: []),
		]),
	})
	const deployedBytecode = await getCode(client, { address: whatsabiResult.address })
	if (!deployedBytecode) {
		throw new Error('Could not fetch deployed bytecode')
	}
	return {
		abi: /** @type {any}*/ (whatsabiResult.abi),
		address: whatsabiResult.address,
		deployedBytecode,
		// TODO if we can get a verified contract we should compile it with solc and return solc output too
	}
}
