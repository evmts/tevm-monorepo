import type { Abi, ContractConstructorArgs } from '@tevm/utils'
import type { CallEvents } from '../common/CallEvents.js'
import type { DeployParams } from './DeployParams.js'
import type { DeployResult } from './DeployResult.js'

/**
 * Handler for deploying contracts on TEVM.
 * This handler is used to deploy a contract by specifying the deployment parameters, ABI, and constructor arguments.
 *
 * @example
 * ```typescript
 * import { createMemoryClient, tevmDeploy } from 'tevm'
 * import { optimism } from 'tevm/common'
 *
 * const client = createMemoryClient({ common: optimism })
 *
 * const result = await tevmDeploy(client, {
 *   abi: [...], // ABI array
 *   bytecode: '0x...', // Contract bytecode
 *   args: [arg1, arg2], // Constructor arguments
 *   from: '0x123...',
 *   gas: 1000000n,
 *   gasPrice: 1n,
 *   // Optional event handlers
 *   onStep: (step, next) => {
 *     console.log(`Executing ${step.opcode.name} at PC=${step.pc}`)
 *     next?.()
 *   }
 * } as const)
 * console.log(result)
 * ```
 *
 * @template TThrowOnFail - Indicates whether to throw an error on failure.
 * @template TAbi - The ABI type of the contract.
 * @template THasConstructor - Indicates whether the contract has a constructor.
 * @template TAllArgs - The types of the constructor arguments.
 *
 * @param {DeployParams<TThrowOnFail, TAbi, THasConstructor, TAllArgs> & CallEvents} action - The deployment parameters and optional event handlers.
 * @returns {Promise<DeployResult>} The result of the deployment.
 */
export type DeployHandler = <
	TThrowOnFail extends boolean = boolean,
	TAbi extends Abi | readonly unknown[] = Abi,
	THasConstructor = TAbi extends Abi
		? Abi extends TAbi
			? true
			: [Extract<TAbi[number], { type: 'constructor' }>] extends [never]
				? false
				: true
		: true,
	TAllArgs = ContractConstructorArgs<TAbi>,
>(
	action: DeployParams<TThrowOnFail, TAbi, THasConstructor, TAllArgs> & CallEvents,
) => Promise<DeployResult>
