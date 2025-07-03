import type { AbiParameter, AbiParametersToPrimitiveTypes, ExtractAbiFunction } from 'abitype'
import { decodeAbiParameters, type Abi, type ContractFunctionName } from 'viem'
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

	if (!previousState || !('abiFunction' in previousState))
		throw new Error('withFunctionArgs() requires a contract with abi and function name')

	const { abiFunction, selector, calldataMap } = previousState
	const calldata = calldataMap.get(selector)

	const actualDecodedArgs = calldata ? calldata.map((calldata) => decodeAbiParameters(abiFunction.inputs, calldata)) : undefined

	const argsMatched = actualDecodedArgs ? actualDecodedArgs.some((decodedArgs) => {
		return Array.isArray(decodedArgs) && args.every((arg, i) => decodedArgs[i] === arg)
	}) : false

	return {
		pass: argsMatched,
		actual: actualDecodedArgs ? Object.fromEntries(actualDecodedArgs.map((decodedArgs, i) => [i, decodedArgs])) : {},
		expected: args,
		message: () =>
			argsMatched
				? 'Expected transaction not to call function with the specified arguments'
				: 'Expected transaction to call function with the specified arguments',
	}
}