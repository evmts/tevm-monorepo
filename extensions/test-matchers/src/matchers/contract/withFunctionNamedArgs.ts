import type { AbiParameter, ExtractAbiFunction } from 'abitype'
import { type Abi, type ContractFunctionName, decodeAbiParameters } from 'viem'
import type { ChainState, MatcherResult } from '../../chainable/types.js'
import type { AbiInputsToNamedArgs } from '../../common/types.js'
import type { ToCallContractFunctionState } from './types.js'

export const withFunctionNamedArgs = <
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
	_received: unknown,
	expectedArgs: Partial<AbiInputsToNamedArgs<TInputs>>,
	chainState?: ChainState<unknown, ToCallContractFunctionState>,
): MatcherResult => {
	if (!chainState?.previousState || !('abiFunction' in chainState.previousState))
		throw new Error('withFunctionNamedArgs() requires a contract with abi and function name')

	const { abiFunction, selector, calldataMap } = chainState.previousState
	const calldata = calldataMap.get(selector)
	const actualDecodedArgs = calldata
		? calldata.map((calldata) => decodeAbiParameters(abiFunction.inputs, calldata))
		: undefined
	const actualNamedArgs = actualDecodedArgs
		? actualDecodedArgs.map((decodedArgs) =>
				abiFunction.inputs.reduce(
					(acc, input, index) => {
						acc[input.name ?? ''] = decodedArgs[index]
						return acc
					},
					{} as Record<string, unknown>,
				),
			)
		: undefined

	const argsMatched = actualNamedArgs
		? actualNamedArgs.some((namedArgs) => {
				return Object.entries(expectedArgs).every(
					([key, value]) => key in namedArgs && namedArgs[key as keyof typeof namedArgs] === value,
				)
			})
		: false

	return {
		pass: argsMatched,
		actual: actualNamedArgs ? Object.fromEntries(actualNamedArgs.map((namedArgs, i) => [i, namedArgs])) : {},
		expected: expectedArgs,
		message: () =>
			argsMatched
				? 'Expected transaction not to call function with the specified arguments'
				: 'Expected transaction to call function with the specified arguments',
	}
}
