import { Block, blockFromRpc } from '@tevm/block'
import { InvalidBlockError, UnknownBlockError } from '@tevm/errors'
import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { numberToHex } from '@tevm/utils'
import { customTxTypes } from './CUSTOM_Tx_TYPES.js'

/**
 * Minimal retry helper to replace viem.withRetry during migration
 * @template T
 * @param {() => Promise<T>} fn - Function to retry
 * @param {{ retryCount?: number, delay?: (params: { count: number, error: Error }) => number }} [options] - Retry options
 * @returns {Promise<T>}
 */
async function withRetry(fn, options) {
	const max = options?.retryCount ?? 3
	const delayFn = options?.delay ?? (() => 100)
	let count = 0
	for (;;) {
		try {
			return await fn()
		} catch (error) {
			count++
			if (count > max) throw error
			const delay = delayFn({ count, error: /** @type {Error} */ (error) })
			await new Promise((r) => setTimeout(r, delay))
		}
	}
}
import { isTevmBlockTag } from './isTevmBlockTag.js'
import { warnOnce } from './warnOnce.js'

/**
 * @param {import('../BaseChain.js').BaseChain} baseChain
 * @param {object} params
 * @param {{request: import('@tevm/utils').EIP1193RequestFn}} params.transport
 * @param {bigint | import('@tevm/utils').BlockTag | import('@tevm/utils').Hex} [params.blockTag]
 * @param {import('@tevm/common').Common} common
 */
export const getBlockFromRpc = async (baseChain, { transport, blockTag = 'latest' }, common) => {
	const doWarning = warnOnce(baseChain)
	const fetcher = createJsonRpcFetcher(transport)
	/**
	 * @param {import('@tevm/utils').RpcBlock<true>} rpcBlock
	 * @returns {[Block, import('@tevm/utils').RpcBlock<true>]}
	 */
	const asEthjsBlock = (rpcBlock) => {
		return [
			blockFromRpc(
				{
					.../** @type {any}*/ (rpcBlock),
					// filter out transactions we don't support as a hack
					transactions: rpcBlock.transactions?.filter((tx) => {
						if (tx.type && customTxTypes.includes(tx.type)) {
							doWarning(/** @type {any}*/ (tx))
							return false
						}
						if (tx.type === '0x3' && tx.blobVersionedHashes && tx.blobVersionedHashes.length > 6) {
							console.warn(
								`Filtering out blob transaction ${tx.hash} with ${tx.blobVersionedHashes.length} blobs (maximum is 6). See https://github.com/evmts/tevm-monorepo/issues/1710`,
							)
							return false
						}
						return true
					}),
				},
				{
					common,
					setHardfork: false,
					freeze: false,
					skipConsensusFormatValidation: true,
				},
			),
			rpcBlock,
		]
	}

	return withRetry(
		async () => {
			// TODO handle errors from fetch better
			if (typeof blockTag === 'bigint') {
				const { result, error } =
					/** @type {{result: import('@tevm/utils').RpcBlock<true>, error: {code: number | string, message: string}}}*/ (
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
