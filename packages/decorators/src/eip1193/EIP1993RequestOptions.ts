// this file is adapted from viem
// see it here https://github.com/wevm/viem/blob/main/src/types/eip1193.ts
// Copied from viem commit a098c98231d47ccac9bda1a944880b034020a1b5
// We copy it here for easier developer experience internally and also
// to lock in these types independent of viem potentially making changes

/**
 * Options for EIP-1193 compatible JSON-RPC requests.
 * Controls retry behavior for network requests to Ethereum providers.
 * @example
 * ```typescript
 * import { EIP1193RequestOptions } from '@tevm/decorators'
 * import { requestEip1193 } from '@tevm/decorators'
 *
 * const node = createTevmNode().extend(requestEip1193())
 *
 * // Add retry options to handle network instability
 * const options: EIP1193RequestOptions = {
 *   retryCount: 3,     // Retry failed requests up to 3 times
 *   retryDelay: 1000   // Wait 1 second between retries
 * }
 *
 * await node.request({
 *   method: 'eth_getBalance',
 *   params: ['0x1234...', 'latest']
 * }, options)
 * ```
 */
export type EIP1193RequestOptions = {
	// The base delay (in ms) between retries.
	retryDelay?: number | undefined
	// The max number of times to retry.
	retryCount?: number | undefined
}
