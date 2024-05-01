import { Block } from '@tevm/block'
import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { EMPTY_STATE_ROOT } from '@tevm/trie'
import { numberToHex } from '@tevm/utils'
import { hexToBytes } from 'viem'
import { putBlock } from './actions/putBlock.js'

/**
 * Keccak-256 hash of the RLP of null
 */
const KECCAK256_RLP_S = '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'
/**
 * Keccak-256 hash of the RLP of null
 */
const KECCAK256_RLP = hexToBytes(KECCAK256_RLP_S)

// TODO move this to @tevm/block and make it coerse the type into type BlockTag if true
/**
 * Determines if an unknown type is a valid block tag
 * @param {unknown} blockTag
 * @returns {boolean} true if valid block tag
 */
const isBlockTag = (blockTag) => {
	return typeof blockTag === 'string' && ['latest', 'earliest', 'pending', 'safe', 'finalized'].includes(blockTag)
}

// TODO move this to @tevm/block
/**
 * @param {object} params
 * @param {string} params.url
 * @param {bigint | import('viem').BlockTag | import('viem').Hex} [params.blockTag]
 */
const getBlockFromRpc = async ({ url, blockTag = 'latest' }) => {
	const fetcher = createJsonRpcFetcher(url)
	/**
	 * @param {import('viem').RpcBlock<'latest', true>} rpcBlock
	 * @returns {Block}
	 */
	const asEthjsBlock = (rpcBlock) => {
		return Block.fromRPC({
			.../** @type {any}*/ (rpcBlock),
			// filter out transactions we don't support as a hack
			transactions: rpcBlock.transactions.filter((tx) => {
				// we currently don't support optimism deposit tx which uses this custom code
				// Optimism type is currently not in viem types
				// @ts-expect-error
				if (tx.type === '0x7e') {
					console.warn(
						`Warning: Optimism deposit transactions (type 0x7e) are currently not supported and will be filtered out of blocks until support is added
filtering out block ${/** @type {import('viem').RpcBlock}*/ (tx).hash}`,
					)
					return false
				}
				return true
			}),
		})
	}
	if (typeof blockTag === 'bigint') {
		const { result } = /** @type {{result: import('viem').RpcBlock<'latest', true>}}*/ (
			await fetcher.request({
				jsonrpc: '2.0',
				id: 1,
				method: 'eth_getBlockByNumber',
				params: [numberToHex(blockTag), true],
			})
		)
		return asEthjsBlock(result)
	}
	if (typeof blockTag === 'string' && blockTag.startsWith('0x')) {
		const { result } = await fetcher.request({
			jsonrpc: '2.0',
			id: 1,
			method: 'eth_getBlockByHash',
			params: [blockTag, true],
		})
		return asEthjsBlock(/** @type {any}*/ (result))
	}
	if (isBlockTag(blockTag)) {
		// TODO add an isBlockTag helper
		const { result } = await fetcher.request({
			jsonrpc: '2.0',
			id: 1,
			method: 'eth_getBlockByNumber',
			params: [blockTag],
		})
		return asEthjsBlock(/** @type {any}*/ (result))
	}
	throw new Error(`Invalid blocktag ${blockTag}`)
}

/**
 * Creates a genesis {@link Block} for the blockchain with params from {@link Common.genesis}
 * @param {Uint8Array} stateRoot The genesis stateRoot
 * @param {import('@tevm/common').Common} common class
 * @returns {Block}
 */
const createGenesisBlock = (stateRoot, common) => {
	const newCommon = common.copy()
	newCommon.setHardforkBy({
		blockNumber: 0,
		td: BigInt(newCommon.genesis().difficulty),
		timestamp: newCommon.genesis().timestamp ?? 0,
	})

	/**
	 * @type {import('@tevm/block').HeaderData}
	 */
	const header = {
		...newCommon.genesis(),
		number: 0,
		stateRoot,
		...(newCommon.isActivatedEIP(4895) ? { withdrawalsRoot: KECCAK256_RLP } : {}),
	}
	return Block.fromBlockData({ header, ...(newCommon.isActivatedEIP(4895) ? { withdrawals: [] } : {}) }, { common })
}
/**
 * @param {import('./ChainOptions.js').ChainOptions} options
 * @returns {import('./BaseChain.js').BaseChain} Base chain object
 */
export const createBaseChain = (options) => {
	/**
	 * @type {import('./BaseChain.js').BaseChain}
	 */
	const chain = {
		options,
		common: options.common,
		blocks: new Map(),
		blocksByTag: new Map(),
		blocksByNumber: new Map(),
		ready: () => genesisBlockPromise.then(() => true),
	}

	// Add genesis block and forked block to chain
	const genesisBlockPromise = (async () => {
		if (options.fork?.url) {
			const block = await getBlockFromRpc(options.fork)
			await putBlock(chain)(block)
		} else {
			await putBlock(chain)(
				options.genesisBlock ?? createGenesisBlock(options.genesisStateRoot ?? EMPTY_STATE_ROOT, options.common),
			)
		}
	})()

	return chain
}
