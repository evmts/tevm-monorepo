import type { Hex } from '@tevm/utils'

/**
 * Based on the JSON-RPC request for `eth_unsubscribe` procedure
 * @example
 * ```typescript
 * import { createTevmNode } from '@tevm/node'
 * import { ethSubscribeHandler, ethUnsubscribeHandler } from '@tevm/actions'
 *
 * const client = createTevmNode()
 * const subscribe = ethSubscribeHandler(client)
 * const unsubscribe = ethUnsubscribeHandler(client)
 *
 * // Subscribe to new block headers
 * const subscriptionId = await subscribe({ subscriptionType: 'newHeads' })
 *
 * // Unsubscribe
 * const success = await unsubscribe({ subscriptionId })
 * console.log(success) // true
 * ```
 */
export type EthUnsubscribeParams = {
	/**
	 * The subscription ID to unsubscribe from
	 */
	readonly subscriptionId: Hex
}
