import { createClient, http } from 'viem'
import { getCode } from 'viem/actions'
import { knownChains } from './knownChains.js'
import { loadAbi } from './loadAbi.js'
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
	/**
	 * @param {number} chainId
	 */
	constructor(chainId) {
		super(
			`Unknown chain ID: ${chainId}. No default rpc known. Please pass in a valid rpc url as a query string \`?rpcUrl=\${rpcUrl}\` or open a pr to viem to add your chain to viem/chains`,
		)
	}
}

// TODO pass in tevm config too
/**
 * @param {import('./ContractUri.js').ContractUri} contractUri
 * @param {import('@tevm/config').ResolvedCompilerConfig} config
 * @returns { Promise<{abi: import('@tevm/utils').Abi, address: import('@tevm/utils').Address, deployedBytecode: import('@tevm/utils').Hex} | undefined>}
 * @throws {UnknownChainError} if the chainId is not known and no rpcUrl is provided
 */
export const resolveContractUri = async (contractUri, config) => {
	console.log('todo config', config)
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

	const whatsabiResult = await loadAbi({
		client,
		explorerUrl,
		address: parsedUri.address,
		followProxies: parsedUri.followProxies ?? true,
		etherscanApiKey: parsedUri.etherscanApiKey,
	})
	const deployedBytecode = await getCode(client, {
		address: /** @type {import('@tevm/utils').Address}*/ (whatsabiResult.address),
	})
	if (!deployedBytecode) {
		throw new Error('Could not fetch deployed bytecode')
	}
	return {
		abi: /** @type {any}*/ (whatsabiResult.abi),
		address: parsedUri.address,
		deployedBytecode,
		// TODO we want to represent proxies in some way like listing the resolved addy
		// ...{resolvedAddress: whatsabiResult.address},
		// TODO if we can get a verified contract we should compile it with solc and return solc output too
	}
}
