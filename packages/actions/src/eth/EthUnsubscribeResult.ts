/**
 * Result of `eth_unsubscribe` procedure
 * Returns true if the subscription was successfully cancelled, false otherwise
 * @example
 * ```typescript
 * import { createTevmNode } from '@tevm/node'
 * import { ethSubscribeHandler, ethUnsubscribeHandler } from '@tevm/actions'
 *
 * const client = createTevmNode()
 * const subscribe = ethSubscribeHandler(client)
 * const unsubscribe = ethUnsubscribeHandler(client)
 *
 * const subscriptionId = await subscribe({ subscriptionType: 'newHeads' })
 * const success = await unsubscribe({ subscriptionId })
 * console.log(success) // true if subscription existed, false otherwise
 * ```
 */
export type EthUnsubscribeResult = boolean
