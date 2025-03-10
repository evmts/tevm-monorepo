import { type JsonRpcSchemaTevm } from '@tevm/decorators'
import type { PublicRpcSchema, TestRpcSchema } from 'viem'

/**
 * The complete JSON-RPC schema for TEVM, combining standard Ethereum methods with TEVM-specific extensions.
 *
 * This type defines the full set of JSON-RPC methods that can be handled by a TEVM client:
 *
 * 1. Standard Ethereum methods (`eth_*`) - For basic blockchain interactions
 * 2. Test methods from Anvil/Hardhat/Ganache - For testing and state manipulation
 * 3. TEVM-specific methods (`tevm_*`) - For advanced EVM functionality
 *
 * Using this schema enables type-safe interaction with the TEVM JSON-RPC API, ensuring
 * that request parameters and return types are properly validated at compile time.
 *
 * The schema includes the following TEVM-specific methods:
 * - `tevm_call`: Execute an EVM call with expanded capabilities
 * - `tevm_dumpState`: Export the current EVM state
 * - `tevm_loadState`: Import a previously dumped state
 * - `tevm_getAccount`: Get detailed account information
 * - `tevm_setAccount`: Modify account state (balance, code, storage)
 *
 * @example
 * ```typescript
 * import { createClient, http } from 'viem'
 * import { optimism } from 'tevm/common'
 * import { createTevmTransport } from 'tevm'
 * import type { TevmRpcSchema } from 'tevm/memory-client'
 *
 * // Create a client with the TEVM transport
 * const client = createClient<TevmRpcSchema>({
 *   transport: createTevmTransport({
 *     fork: { transport: http('https://mainnet.optimism.io')({}) }
 *   }),
 *   chain: optimism,
 * })
 *
 * async function example() {
 *   // Use TEVM-specific methods
 *   const callResult = await client.request({
 *     method: 'tevm_call',
 *     params: [{
 *       to: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
 *       data: '0x70a08231000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045', // balanceOf(vitalik.eth)
 *       createTrace: true
 *     }],
 *   })
 *
 *   // Use standard Ethereum methods
 *   const balance = await client.request({
 *     method: 'eth_getBalance',
 *     params: ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045', 'latest'],
 *   })
 *
 *   // Use test methods
 *   await client.request({
 *     method: 'anvil_setBalance',
 *     params: ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045', '0xDE0B6B3A7640000'], // 1 ETH
 *   })
 *
 *   console.log({ callResult, balance })
 * }
 *
 * example()
 * ```
 *
 * @type {Array<PublicRpcSchema[number] | TestRpcSchema[number] | JsonRpcSchemaTevm[keyof JsonRpcSchemaTevm]>}
 * @see [TEVM JSON-RPC Guide](https://tevm.sh/learn/json-rpc/) - Official documentation of TEVM's JSON-RPC API
 * @see [EIP-1193 Specification](https://eips.ethereum.org/EIPS/eip-1193) - Ethereum Provider JavaScript API
 * @see [Ethereum JSON-RPC](https://ethereum.org/en/developers/docs/apis/json-rpc/) - Standard Ethereum JSON-RPC API
 */
export type TevmRpcSchema = [
	...PublicRpcSchema,
	...TestRpcSchema<'anvil' | 'ganache' | 'hardhat'>,
	JsonRpcSchemaTevm['tevm_call'],
	JsonRpcSchemaTevm['tevm_dumpState'],
	JsonRpcSchemaTevm['tevm_loadState'],
	JsonRpcSchemaTevm['tevm_getAccount'],
	JsonRpcSchemaTevm['tevm_setAccount'],
]
