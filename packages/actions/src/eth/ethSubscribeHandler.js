import { InvalidParamsError } from '@tevm/errors'
import { isArray } from '../utils/isArray.js'
import { generateRandomId } from './utils/generateRandomId.js'

/**
 * @typedef {InvalidParamsError} EthSubscribeError
 */

/**
 * Creates a subscription for various Ethereum events.
 * Subscriptions work similar to filters but are typically used with WebSocket transports.
 * In Tevm, subscriptions are implemented using the same Filter infrastructure as eth_newFilter.
 *
 * @param {import('@tevm/node').TevmNode} tevmNode
 * @returns {import('./EthHandler.js').EthSubscribeHandler}
 * @example
 * ```typescript
 * import { createTevmNode } from '@tevm/node'
 * import { ethSubscribeHandler } from '@tevm/actions'
 *
 * const client = createTevmNode()
 * const subscribe = ethSubscribeHandler(client)
 *
 * // Subscribe to new block headers
 * const subscriptionId = await subscribe({ subscriptionType: 'newHeads' })
 *
 * // Subscribe to logs with filter
 * const logsSubscriptionId = await subscribe({
 *   subscriptionType: 'logs',
 *   filterParams: {
 *     address: '0x1234567890123456789012345678901234567890',
 *     topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef']
 *   }
 * })
 *
 * // Subscribe to pending transactions
 * const txSubscriptionId = await subscribe({ subscriptionType: 'newPendingTransactions' })
 * ```
 */
export const ethSubscribeHandler = (tevmNode) => {
	return async (params) => {
		const { subscriptionType } = params
		const id = generateRandomId()

		tevmNode.logger.debug({ subscriptionType, id }, 'ethSubscribeHandler: Creating subscription')

		switch (subscriptionType) {
			case 'newHeads': {
				/**
				 * @param {import('@tevm/block').Block} block
				 */
				const listener = (block) => {
					const filter = tevmNode.getFilters().get(id)
					if (!filter) {
						tevmNode.logger.debug({ id }, 'ethSubscribeHandler: Filter not found for newHeads')
						return
					}
					filter.blocks.push(block)
					tevmNode.logger.debug(
						{ id, blockNumber: block.header.number },
						'ethSubscribeHandler: Added block to subscription',
					)
				}

				tevmNode.on('newBlock', listener)
				tevmNode.setFilter({
					id,
					type: 'Block',
					created: Date.now(),
					logs: [],
					tx: [],
					blocks: [],
					installed: {},
					err: undefined,
					registeredListeners: [listener],
				})

				tevmNode.logger.debug({ id }, 'ethSubscribeHandler: Created newHeads subscription')
				return id
			}

			case 'logs': {
				const logsParams = /** @type {import('./EthSubscribeParams.js').EthSubscribeLogsParams} */ (params)
				const { filterParams } = logsParams

				/**
				 * @param {import('@tevm/node').Filter['logs'][number]} log
				 */
				const listener = (log) => {
					const filter = tevmNode.getFilters().get(id)
					if (!filter) {
						tevmNode.logger.debug({ id }, 'ethSubscribeHandler: Filter not found for logs')
						return
					}

					// Apply address filter if specified
					if (filterParams?.address) {
						const addresses = isArray(filterParams.address) ? filterParams.address : [filterParams.address]
						const normalizedAddresses = addresses.map((addr) => addr.toLowerCase())
						if (!normalizedAddresses.includes(log.address.toLowerCase())) {
							return
						}
					}

					// Apply topics filter if specified
					if (filterParams?.topics) {
						const topicsMatch = filterParams.topics.every((topicFilter, index) => {
							if (topicFilter === null || topicFilter === undefined) {
								return true
							}
							if (!log.topics[index]) {
								return false
							}
							if (isArray(topicFilter)) {
								return topicFilter.some((topic) => topic.toLowerCase() === log.topics[index]?.toLowerCase())
							}
							return topicFilter.toLowerCase() === log.topics[index]?.toLowerCase()
						})
						if (!topicsMatch) {
							return
						}
					}

					filter.logs.push(log)
					tevmNode.logger.debug(
						{ id, logAddress: log.address, topics: log.topics },
						'ethSubscribeHandler: Added log to subscription',
					)
				}

				tevmNode.on('newLog', listener)
				tevmNode.setFilter({
					id,
					type: 'Log',
					created: Date.now(),
					logs: [],
					tx: [],
					blocks: [],
					logsCriteria: filterParams,
					installed: {},
					err: undefined,
					registeredListeners: [listener],
				})

				tevmNode.logger.debug({ id, filterParams }, 'ethSubscribeHandler: Created logs subscription')
				return id
			}

			case 'newPendingTransactions': {
				/**
				 * @param {import('@tevm/tx').TypedTransaction | import('@tevm/tx').ImpersonatedTx} tx
				 */
				const listener = (tx) => {
					const filter = tevmNode.getFilters().get(id)
					if (!filter) {
						tevmNode.logger.debug({ id }, 'ethSubscribeHandler: Filter not found for newPendingTransactions')
						return
					}
					filter.tx.push(tx)
					tevmNode.logger.debug({ id, txHash: tx.hash() }, 'ethSubscribeHandler: Added tx to subscription')
				}

				tevmNode.on('newPendingTransaction', listener)
				tevmNode.setFilter({
					id,
					type: 'PendingTransaction',
					created: Date.now(),
					logs: [],
					tx: [],
					blocks: [],
					installed: {},
					err: undefined,
					registeredListeners: [listener],
				})

				tevmNode.logger.debug({ id }, 'ethSubscribeHandler: Created newPendingTransactions subscription')
				return id
			}

			case 'syncing': {
				// Syncing subscriptions return sync status changes
				// For now, we create a subscription but don't emit events for it
				// since Tevm's syncing behavior is different from a full node
				tevmNode.setFilter({
					id,
					type: 'Block', // Use Block type as a placeholder
					created: Date.now(),
					logs: [],
					tx: [],
					blocks: [],
					installed: {},
					err: undefined,
					registeredListeners: [],
				})

				tevmNode.logger.debug({ id }, 'ethSubscribeHandler: Created syncing subscription (no-op)')
				return id
			}

			default: {
				const err = new InvalidParamsError(
					`Invalid subscription type: ${/** @type {any} */ (params).subscriptionType}. Valid types are: newHeads, logs, newPendingTransactions, syncing`,
				)
				tevmNode.logger.error(err, 'ethSubscribeHandler: Invalid subscription type')
				throw err
			}
		}
	}
}
