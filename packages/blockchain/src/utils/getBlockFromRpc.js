import { Block, blockFromRpc } from '@tevm/block'
import { InvalidBlockError, UnknownBlockError } from '@tevm/errors'
import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { numberToHex } from '@tevm/utils'
import { withRetry } from 'viem'
import { customTxTypes } from './CUSTOM_Tx_TYPES.js'
import { isTevmBlockTag } from './isTevmBlockTag.js'
import { warnOnce } from './warnOnce.js'

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
	 * @param {import('viem').RpcBlock<import('viem').BlockTag, true>} rpcBlock
	 * @returns {[Block, import('viem').RpcBlock<import('viem').BlockTag, true>]}
	 */
	const asEthjsBlock = (rpcBlock) => {
		return [
			blockFromRpc(
				{
					.../** @type {any}*/ (rpcBlock),
					// filter out transactions we don't support as a hack
					transactions: rpcBlock.transactions?.filter((tx) => {
						// Filter out custom transaction types that we don't support
						if (customTxTypes.includes(tx.type)) {
							doWarning(/** @type {any}*/ (tx))
							return false
						}
						
						// Filter out blob transactions with more than 6 blobs
						// EIP-4844 limits blob transactions to a maximum of 6 blobs
						if (tx.type === '0x3' && tx.blobVersionedHashes && tx.blobVersionedHashes.length > 6) {
							doWarning({
								...tx,
								_warning: `Filtering out blob transaction with ${tx.blobVersionedHashes.length} blobs (maximum is 6)`
							})
							return false
						}
						
						return true
					}),
				},
				{ common, setHardfork: false, freeze: false, skipConsensusFormatValidation: true },
			),
			rpcBlock,
		]
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
					// TODO we should handle this error code better
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
			if (isTevmBlockTag(blockTag)) {
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
