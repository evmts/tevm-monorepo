import type { CallResult } from '../Call/CallResult.js'

/**
 * Represents the result of a contract deployment on TEVM.
 * This type extends the CallResult type, which includes properties like gas usage, logs, and errors.
 *
 * @example
 * ```typescript
 * import { createMemoryClient, tevmDeploy } from 'tevm'
 * import { optimism } from 'tevm/common'
 * import type { DeployResult } from 'tevm/actions'
 *
 * const client = createMemoryClient({ common: optimism })
 *
 * const deployParams = {
 *   bytecode: '0x6000366000...',
 *   abi: [{
 *     inputs: [],
 *     stateMutability: 'nonpayable',
 *     type: 'constructor'
 *   }],
 *   args: [],
 *   from: '0xYourAccountAddress',
 *   gas: 1000000n,
 *   createTransaction: true
 * } as const
 *
 * const result: DeployResult = await tevmDeploy(client, deployParams)
 * console.log('Deployed contract address:', result.createdAddress)
 * console.log('Gas used:', result.executionGasUsed)
 * ```
 *
 * @see CallResult for a detailed breakdown of the available properties.
 */
export type DeployResult = CallResult
