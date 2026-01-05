import { type JsonRpcSchemaTevm } from '@tevm/decorators'
import type { PublicRpcSchema, TestRpcSchema } from 'viem'

/**
 * The JSON-RPC schema for TEVM.
 * This type represents the JSON-RPC requests that the EIP-1193 client can handle when using TEVM.
 * It includes public, test, and TEVM-specific methods.
 * @example
 * ```typescript
 * import { createClient } from 'viem'
 * import { http } from '@tevm/utils'
 * import { optimism } from 'tevm/common'
 * import { createTevmTransport } from 'tevm'
 *
 * const client = createClient({
 *   transport: createTevmTransport({
 *     fork: { transport: http('https://mainnet.optimism.io')({}) }
 *   }),
 *   chain: optimism,
 * })
 *
 * async function example() {
 *   const result = await client.request({
 *     method: 'tevm_call',
 *     params: [{ to: '0x123...', data: '0x123...' }],
 *   })
 *   console.log(result)
 * }
 *
 * example()
 * ```
 *
 * @see [Tevm JSON-RPC guide](https://tevm.sh/learn/json-rpc/)
 * @see [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193)
 * @see [Ethereum jsonrpc](https://ethereum.org/en/developers/docs/apis/json-rpc/)
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
