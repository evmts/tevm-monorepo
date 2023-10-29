import type { CallParameters } from '../actions/public/call.js'
import type { Chain } from '../types/chain.js'
import type { Hex } from '../types/misc.js'
import { type DecodeErrorResultReturnType } from '../utils/abi/decodeErrorResult.js'
import { BaseError } from './base.js'
import type { Abi, Address } from 'abitype'
export declare class CallExecutionError extends BaseError {
	cause: BaseError
	name: string
	constructor(
		cause: BaseError,
		{
			account: account_,
			docsPath,
			chain,
			data,
			gas,
			gasPrice,
			maxFeePerGas,
			maxPriorityFeePerGas,
			nonce,
			to,
			value,
		}: CallParameters & {
			chain?: Chain
			docsPath?: string
		},
	)
}
export declare class ContractFunctionExecutionError extends BaseError {
	abi: Abi
	args?: unknown[]
	cause: BaseError
	contractAddress?: Address
	formattedArgs?: string
	functionName: string
	sender?: Address
	name: string
	constructor(
		cause: BaseError,
		{
			abi,
			args,
			contractAddress,
			docsPath,
			functionName,
			sender,
		}: {
			abi: Abi
			args?: any
			contractAddress?: Address
			docsPath?: string
			functionName: string
			sender?: Address
		},
	)
}
export declare class ContractFunctionRevertedError extends BaseError {
	name: string
	data?: DecodeErrorResultReturnType
	reason?: string
	signature?: Hex
	constructor({
		abi,
		data,
		functionName,
		message,
	}: {
		abi: Abi
		data?: Hex
		functionName: string
		message?: string
	})
}
export declare class ContractFunctionZeroDataError extends BaseError {
	name: string
	constructor({
		functionName,
	}: {
		functionName: string
	})
}
export declare class RawContractError extends BaseError {
	code: number
	name: string
	data?:
		| Hex
		| {
				data?: Hex
		  }
	constructor({
		data,
		message,
	}: {
		data?:
			| Hex
			| {
					data?: Hex
			  }
		message?: string
	})
}
//# sourceMappingURL=contract.d.ts.map
