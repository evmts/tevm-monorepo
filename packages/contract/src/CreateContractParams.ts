import type { Address, Hex } from '@tevm/utils'
import type { Contract } from './Contract.js'

/**
 * Params for creating a {@link Contract} instance
 * @see {@link CreateContract}
 */
export type CreateContractParams<
	TName extends string | undefined | never,
	THumanReadableAbi extends readonly string[],
	TAddress extends undefined | Address | never,
	// Bytecode is the contract bytecode with constructor
	TBytecode extends undefined | Hex | never,
	// DeployedBytecode is the raw bytecode without constructor
	TDeployedBytecode extends undefined | Hex | never,
	// Code is Bytecode encoded with constructor arguments
	TCode extends undefined | Hex | never,
> = {
	name?: TName
	humanReadableAbi: THumanReadableAbi
	address?: TAddress
	bytecode?: TBytecode
	deployedBytecode?: TDeployedBytecode
	code?: TCode
}
