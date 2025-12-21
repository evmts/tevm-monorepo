import type { Address, Hex } from '@tevm/utils'

/**
 * Parameters for `newHeads` subscription type
 * Subscribe to new block headers
 */
export type EthSubscribeNewHeadsParams = {
	readonly subscriptionType: 'newHeads'
}

/**
 * Parameters for `logs` subscription type
 * Subscribe to logs/events matching the filter criteria
 */
export type EthSubscribeLogsParams = {
	readonly subscriptionType: 'logs'
	readonly filterParams?: {
		/**
		 * The address(es) to filter logs by
		 */
		readonly address?: Address | readonly Address[]
		/**
		 * Topics to filter logs by
		 */
		readonly topics?: readonly (Hex | readonly Hex[] | null)[]
	}
}

/**
 * Parameters for `newPendingTransactions` subscription type
 * Subscribe to pending transaction hashes
 */
export type EthSubscribeNewPendingTransactionsParams = {
	readonly subscriptionType: 'newPendingTransactions'
}

/**
 * Parameters for `syncing` subscription type
 * Subscribe to sync status changes
 */
export type EthSubscribeSyncingParams = {
	readonly subscriptionType: 'syncing'
}

/**
 * Based on the JSON-RPC request for `eth_subscribe` procedure
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
 * // Subscribe to logs
 * const logsSubscriptionId = await subscribe({
 *   subscriptionType: 'logs',
 *   filterParams: {
 *     address: '0x1234567890123456789012345678901234567890',
 *     topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef']
 *   }
 * })
 * ```
 */
export type EthSubscribeParams =
	| EthSubscribeNewHeadsParams
	| EthSubscribeLogsParams
	| EthSubscribeNewPendingTransactionsParams
	| EthSubscribeSyncingParams
