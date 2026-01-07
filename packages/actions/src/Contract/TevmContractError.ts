import type { TevmCallError } from '../Call/TevmCallError.js'

/**
 * TEVM Contract Error type.
 *
 * This type represents all errors that can occur during a TEVM contract call.
 * It extends from the `TevmCallError` type, inheriting all possible call errors.
 *
 * @example
 * ```typescript
 * import { createMemoryClient, tevmContract } from 'tevm'
 * import { optimism } from 'tevm/common'
 * import type { TevmContractError } from 'tevm/errors'
 *
 * const client = createMemoryClient({ common: optimism })
 *
 * const result = await tevmContract(client, {
 *   abi: [...], // ABI array
 *   functionName: 'myFunction',
 *   args: [arg1, arg2],
 *   to: '0x123...',
 *   from: '0x123...',
 *   gas: 1000000n,
 *   gasPrice: 1n,
 *   skipBalance: true,
 * } as const)
 *
 * if (result.errors) {
 *   const typedError: TevmContractError = result.errors[0]
 *   console.error('Contract call failed with error:', typedError)
 * }
 * ```
 *
 * @see {@link TevmCallError}
 */
export type TevmContractError = TevmCallError
