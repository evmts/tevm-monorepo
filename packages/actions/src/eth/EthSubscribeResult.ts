import type { Hex } from '@tevm/utils'

/**
 * Result of `eth_subscribe` procedure
 * Returns a subscription ID that can be used to unsubscribe
 * @example
 * ```typescript
 * import { createTevmNode } from '@tevm/node'
 * import { ethSubscribeHandler } from '@tevm/actions'
 *
 * const client = createTevmNode()
 * const subscribe = ethSubscribeHandler(client)
 *
 * const subscriptionId = await subscribe({ subscriptionType: 'newHeads' })
 * console.log(subscriptionId) // '0x1'
 * ```
 */
export type EthSubscribeResult = Hex
