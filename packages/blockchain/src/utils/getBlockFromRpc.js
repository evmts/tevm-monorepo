import { Block, blockFromRpc } from '@tevm/block'
import { InvalidBlockError, UnknownBlockError } from '@tevm/errors'
import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { numberToHex } from '@tevm/utils'
import { withRetry } from 'viem'
import { warnOnce } from './warnOnce.js'

/**
 * Determines if an unknown type is a valid block tag
 * @param {unknown} blockTag
 * @returns {boolean} true if valid block tag
 */
const isBlockTag = (blockTag) => {
	return typeof blockTag === 'string' && ['latest', 'earliest', 'pending', 'safe', 'finalized'].includes(blockTag)
}

/**
 * @param {import('../BaseChain.js').BaseChain} baseChain
 * @param {object} params
 * @param {{request: import('viem').EIP1193RequestFn}} params.transport
 * @param {bigint | import('viem').BlockTag | import('viem').Hex} [params.blockTag]
 * @param {import('@tevm/common').Common} common
 */
export const getBlockFromRpc = async (baseChain, { transport, blockTag = 'latest' }, common) => {
	const doWarning = warnOnce(baseChain)
	const fetcher = createJsonRpcFetcher(transport)
	/**
	 * @param {import('viem').RpcBlock<'latest', true>} rpcBlock
	 * @returns {Block}
	 */
	const asEthjsBlock = (rpcBlock) => {
		return blockFromRpc(
			{
				.../** @type {any}*/ (rpcBlock),
				// filter out transactions we don't support as a hack
				transactions: rpcBlock.transactions?.filter((tx) => {
					// we currently don't support optimism deposit tx which uses this custom code
					// Optimism type is currently not in viem types
					// @ts-expect-error
					if (tx.type === '0x7e') {
						doWarning(tx)
						return false
					}
					return true
				}),
			},
			{ common, setHardfork: false, freeze: false, skipConsensusFormatValidation: true },
		)
	}

	return withRetry(
		async () => {
			// TODO handle errors from fetch better
			if (typeof blockTag === 'bigint') {
				const { result, error } =
					/** @type {{result: import('viem').RpcBlock<'latest', true>, error: {code: number | string, message: string}}}*/ (
						await fetcher.request({
							jsonrpc: '2.0',
							id: 1,
							method: 'eth_getBlockByNumber',
							params: [numberToHex(blockTag), true],
						})
					)
				if (error) {
					throw error
				}
				if (!result) {
					throw new UnknownBlockError('No block found')
				}
				return asEthjsBlock(result)
			}
			if (typeof blockTag === 'string' && blockTag.startsWith('0x')) {
				const { result, error } = await fetcher.request({
					jsonrpc: '2.0',
					id: 1,
					method: 'eth_getBlockByHash',
					params: [blockTag, true],
				})
				if (error) {
					throw error
				}
				if (!result) {
					throw new UnknownBlockError('No block found')
				}
				return asEthjsBlock(/** @type {any}*/ (result))
			}
			if (isBlockTag(blockTag)) {
				// TODO add an isBlockTag helper
				const { result, error } = await fetcher.request({
					jsonrpc: '2.0',
					id: 1,
					method: 'eth_getBlockByNumber',
					params: [blockTag, true],
				})
				if (error) {
					throw error
				}
				if (!result) {
					throw new UnknownBlockError('No block found')
				}
				return asEthjsBlock(/** @type {any}*/ (result))
			}
			throw new InvalidBlockError(`Invalid blocktag ${blockTag}`)
		},
		{
			retryCount: 3,
			delay: ({ count }) => {
				return count * 200
			},
		},
	)
}
