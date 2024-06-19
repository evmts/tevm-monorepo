import type { Contract } from '@tevm/contract'
import type { ExecResult } from '@tevm/evm'
import type { Address, Hex } from '@tevm/utils'
import { Precompile } from './Precompile.js'

export const definePrecompile = <
	TContract extends Contract<any, any, Address, any, any, any> = Contract<
		string,
		ReadonlyArray<string>,
		Address,
		any,
		any,
		any
	>,
>({
	contract,
	call,
}: {
	contract: TContract
	call: (context: {
		data: Hex
		gasLimit: bigint
	}) => Promise<ExecResult>
}): Precompile<TContract> => {
	return new Precompile(contract, call)
}
