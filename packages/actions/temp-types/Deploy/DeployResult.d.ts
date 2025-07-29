import type { CallResult } from '../Call/CallResult.js';
/**
 * Represents the result of a contract deployment on TEVM.
 * This type extends the CallResult type, which includes properties like gas usage, logs, and errors.
 *
 * @example
 * ```typescript
 * import { createClient } from 'viem'
 * import { deployHandler } from 'tevm/actions'
 *
 * const client = createClient({
 *   transport: createTevmTransport({
 *     fork: { transport: http('https://mainnet.optimism.io')({}) }
 *   })
 * })
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
 * }
 *
 * const result: DeployResult = await deployHandler(client)(deployParams)
 * console.log('Deployed contract address:', result.createdAddress)
 * console.log('Gas used:', result.executionGasUsed)
 * ```
 *
 * @see CallResult for a detailed breakdown of the available properties.
 */
export type DeployResult = CallResult;
//# sourceMappingURL=DeployResult.d.ts.map