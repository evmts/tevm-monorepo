import type { EIP1193RequestFn } from '@tevm/decorators'
import type { TevmNode } from '@tevm/node'
import type { Chain, ClientConfig, TransportConfig } from 'viem'

/**
 * A custom Transport implementation for viem that uses TEVM as its backend.
 * 
 * This transport enables viem clients to communicate with TEVM's in-memory EVM implementation,
 * providing a seamless interface between viem's API and TEVM's execution environment.
 * The transport handles converting between viem's request format and TEVM's internal API.
 *
 * @template TName - The name of the transport, defaults to string.
 * @template TChain - The blockchain configuration, extends Chain or undefined.
 *
 * @param {object} config - Transport configuration options
 * @param {TChain} [config.chain] - Chain configuration for the transport
 * @param {number} [config.pollingInterval] - Interval for polling operations in milliseconds
 * @param {number} [config.retryCount] - Number of times to retry failed requests
 * @param {number} [config.timeout] - Request timeout in milliseconds
 * 
 * @returns {object} The configured TEVM transport
 * @returns {TransportConfig<TName>} config - The transport configuration
 * @returns {EIP1193RequestFn} request - EIP-1193 compatible request function
 * @returns {object} value - Additional transport values
 * @returns {TevmNode & { request: EIP1193RequestFn }} value.tevm - The TEVM node instance
 * 
 * @throws {Error} When chain configuration is incompatible
 * @throws {Error} When request execution fails
 * 
 * @example
 * ```typescript
 * import { createClient } from 'viem'
 * import { optimism } from 'tevm/common'
 * import { createTevmTransport } from 'tevm'
 * 
 * // Create a transport with specific configuration
 * const transport = createTevmTransport({
 *   fork: { 
 *     transport: http('https://mainnet.optimism.io')({})
 *   },
 *   common: optimism
 * })
 * 
 * // Use the transport with a viem client
 * const client = createClient({
 *   transport,
 *   chain: optimism
 * })
 * 
 * // Execute standard viem requests
 * const blockNumber = await client.getBlockNumber()
 * console.log(blockNumber)
 * ```
 * 
 * @see {@link createTevmTransport} - Function to create this transport
 * @see [Viem Transport Documentation](https://viem.sh/docs/clients/transports/http)
 */
export type TevmTransport<TName extends string = string> = <TChain extends Chain | undefined = Chain>({
	chain,
	pollingInterval,
	retryCount,
	timeout,
}: {
	chain?: TChain | undefined
	pollingInterval?: ClientConfig['pollingInterval'] | undefined
	retryCount?: TransportConfig['retryCount'] | undefined
	timeout?: TransportConfig['timeout'] | undefined
}) => {
	config: TransportConfig<TName>
	request: EIP1193RequestFn
	value: { tevm: TevmNode & { request: EIP1193RequestFn } }
}
