import type { AbiParameter, AbiParametersToPrimitiveTypes, ExtractAbiFunction } from 'abitype'
import { type Abi, type ContractFunctionName, decodeFunctionData } from 'viem'
import { parseChainArgs } from '../../chainable/chainable.js'
import type { ChainState, MatcherResult } from '../../chainable/types.js'
import type { ToCallContractFunctionState } from './types.js'

export const withFunctionArgs = <
	TAbi extends Abi | undefined = Abi | undefined,
	TFunctionName extends TAbi extends Abi ? ContractFunctionName<TAbi> : never = TAbi extends Abi
		? ContractFunctionName<TAbi>
		: never,
	TInputs extends readonly AbiParameter[] = TAbi extends Abi
		? ExtractAbiFunction<TAbi, TFunctionName> extends { inputs: infer U extends readonly AbiParameter[] }
			? U
			: readonly AbiParameter[]
		: never,
>(
	// @ts-expect-error - unused variable
	received: unknown,
	...argsAndChainState: readonly [
		...AbiParametersToPrimitiveTypes<TInputs>,
		ChainState<unknown, ToCallContractFunctionState>,
	]
): MatcherResult => {
	const {
		args,
		chainState: { previousState },
	} = parseChainArgs<unknown, ToCallContractFunctionState>(argsAndChainState)

	if (!previousState || !('contract' in previousState))
		throw new Error('withFunctionArgs() requires a contract with abi and function name')

	const { contract, decodedFunctionData, rawFunctionData } = previousState
	const decodedFunction =
		decodedFunctionData ??
		(rawFunctionData && contract ? decodeFunctionData({ abi: contract?.abi, data: rawFunctionData }) : undefined)
	const decodedArgs = decodedFunction?.args
	if (!decodedArgs) throw new Error('Could not decode function data')

	const argsMatched = args.length <= decodedArgs.length && args.every((arg, i) => decodedArgs[i] === arg)

	return {
		pass: argsMatched,
		actual: decodedArgs,
		expected: args,
		message: () =>
			argsMatched
				? 'Expected transaction not to call function with the specified arguments'
				: 'Expected transaction to call function with the specified arguments',
	}
}