/**
 * Cancels an active subscription.
 * This handler removes the subscription and cleans up any associated event listeners.
 *
 * @param {import('@tevm/node').TevmNode} tevmNode
 * @returns {import('./EthHandler.js').EthUnsubscribeHandler}
 * @example
 * ```typescript
 * import { createTevmNode } from '@tevm/node'
 * import { ethSubscribeHandler, ethUnsubscribeHandler } from '@tevm/actions'
 *
 * const client = createTevmNode()
 * const subscribe = ethSubscribeHandler(client)
 * const unsubscribe = ethUnsubscribeHandler(client)
 *
 * // Create a subscription
 * const subscriptionId = await subscribe({ subscriptionType: 'newHeads' })
 *
 * // Later, cancel the subscription
 * const success = await unsubscribe({ subscriptionId })
 * console.log(success) // true if subscription existed, false otherwise
 * ```
 */
export const ethUnsubscribeHandler = (tevmNode) => {
	return async (params) => {
		const { subscriptionId } = params

		tevmNode.logger.debug({ subscriptionId }, 'ethUnsubscribeHandler: Unsubscribing')

		const filter = tevmNode.getFilters().get(subscriptionId)
		if (!filter) {
			tevmNode.logger.debug({ subscriptionId }, 'ethUnsubscribeHandler: Subscription not found')
			return false
		}

		// Remove event listeners based on filter type
		const [listener] = filter.registeredListeners
		if (filter.type === 'Log' && listener) {
			tevmNode.removeListener('newLog', listener)
			tevmNode.logger.debug({ subscriptionId }, 'ethUnsubscribeHandler: Removed newLog listener')
		} else if (filter.type === 'Block' && listener) {
			tevmNode.removeListener('newBlock', listener)
			tevmNode.logger.debug({ subscriptionId }, 'ethUnsubscribeHandler: Removed newBlock listener')
		} else if (filter.type === 'PendingTransaction' && listener) {
			tevmNode.removeListener('newPendingTransaction', listener)
			tevmNode.logger.debug({ subscriptionId }, 'ethUnsubscribeHandler: Removed newPendingTransaction listener')
		}

		// Remove the filter
		tevmNode.removeFilter(subscriptionId)
		tevmNode.logger.debug({ subscriptionId }, 'ethUnsubscribeHandler: Subscription removed')

		return true
	}
}
