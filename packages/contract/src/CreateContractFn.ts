import type { Address, Hex } from '@tevm/utils'
import type { Contract } from './Contract.js'
import type { CreateContractParams } from './CreateContractParams.js'

/**
 * Type of `createContract` factory function
 * Creates a tevm Contract instance from human readable abi
 * @example
 * ```typescript
 * import { type Contract, createContract} from 'tevm/contract'
 *
 * const contract: Contract = createContract({
 *   name: 'MyContract',
 *  	abi: [
 *  		...
 *  	],
 * })
 * ```
 *
 * To use a json abi first pass it into `formatAbi` to turn it into human readable
 * @example
 * ```typescript
 * import { type Contract, createContract} from 'tevm/contract'
 *
 * const contract = createContract({
 *   name: 'MyContract',
 *  	abi: [
 *  		...
 *  	],
 * })
 * ```
 */
export type CreateContractFn = <
	TName extends string,
	THumanReadableAbi extends readonly string[],
	TAddress extends undefined | Address = undefined,
	// Bytecode is the contract bytecode with constructor
	TBytecode extends undefined | Hex = undefined,
	// DeployedBytecode is the raw bytecode without constructor
	TDeployedBytecode extends undefined | Hex = undefined,
	// Code is Bytecode encoded with constructor arguments
	TCode extends undefined | Hex = undefined,
>({
	name,
	humanReadableAbi,
	bytecode,
	deployedBytecode,
	code,
}: CreateContractParams<TName, THumanReadableAbi, TAddress, TBytecode, TDeployedBytecode, TCode>) => Contract<
	TName,
	THumanReadableAbi,
	TAddress,
	TBytecode,
	TDeployedBytecode,
	TCode
>
