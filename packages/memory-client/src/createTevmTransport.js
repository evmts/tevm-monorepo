import { requestEip1193 } from '@tevm/decorators'
import { custom } from 'viem'

/**
 * Creates a custom TEVM Transport for viem, providing an in-memory Ethereum execution environment.
 *
 * This function creates a transport implementation that connects viem clients to TEVM's in-memory
 * Ethereum Virtual Machine. It takes a TevmNode and ensures it has an EIP-1193 request function,
 * making it compatible with viem's transport system.
 * 
 * @param {import('@tevm/node').TevmNode & Partial<{request: import('@tevm/decorators').EIP1193RequestFn}>} tevmNode - A TevmNode instance to use as the transport provider
 * @returns {import('./TevmTransport.js').TevmTransport} A configured TEVM transport
 * @throws {Error} When initialization fails or options are invalid
 *
 * @example
 * ```typescript
 * import { createTevmNode } from 'tevm/node'
 * import { createClient } from 'viem'
 * import { createTevmTransport } from 'tevm'
 * import { optimism } from 'tevm/common'
 *
 * // Create the TEVM node
 * const node = createTevmNode({
 *   fork: { 
 *     transport: http('https://mainnet.optimism.io')({}) 
 *   },
 *   common: optimism
 * }).extend(requestEip1193())
 *
 * // Create a client using the TEVM transport
 * const client = createClient({
 *   transport: createTevmTransport(node),
 *   chain: optimism,
 * })
 *
 * async function example() {
 *   const blockNumber = await client.getBlockNumber()
 *   console.log(blockNumber)
 * }
 *
 * example()
 * ```
 *
 * @see {@link createMemoryClient} - For a batteries-included client with all actions pre-configured
 * @see {@link TevmTransport} - The transport type returned by this function
 * @see [Viem Client Documentation](https://viem.sh/docs/clients/introduction)
 * @see [TEVM Client Guide](https://tevm.sh/learn/clients/)
 * @see [TEVM JSON-RPC Guide](https://tevm.sh/learn/json-rpc/)
 * @see [EIP-1193 Specification](https://eips.ethereum.org/EIPS/eip-1193)
 */
export const createTevmTransport = (tevmNode) => {
  if (!tevmNode) {
    throw new Error('tevmNode is required to create a TevmTransport')
  }

  // Ensure the node has an EIP-1193 request function
  /** @type {import('@tevm/node').TevmNode & {request: import('@tevm/decorators').EIP1193RequestFn}} */
  const nodeWithRequest = tevmNode.request ? 
    /** @type {any} */ (tevmNode) : 
    /** @type {any} */ (tevmNode.extend(requestEip1193()))
  
  // Create and return the transport function
  /**
   * @type {import('./MemoryClient.js').TevmTransport}
   */
  return ({ timeout = 20_000, retryCount = 3, chain }) => {
    const transport = custom(nodeWithRequest)({
      chain,
      timeout,
      retryCount,
    })
    
    // Add the tevm field to the value property
    return {
      ...transport,
      value: { 
        ...transport.value,
        tevm: nodeWithRequest
      }
    }
  }
}
