import type { AbiParameter, ExtractAbiFunction } from 'abitype'
import { type Abi, type ContractFunctionName, decodeFunctionData } from 'viem'
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
	// @ts-expect-error - unused variable
	received: unknown,
	expectedArgs: Partial<AbiInputsToNamedArgs<TInputs>>,
	chainState?: ChainState<unknown, ToCallContractFunctionState>,
): MatcherResult => {
	if (!chainState?.previousState || !('contract' in chainState.previousState))
		throw new Error('withFunctionNamedArgs() requires a contract with abi and function name')

	const { contract, decodedFunctionData, rawFunctionData } = chainState.previousState
	const decodedFunction =
		decodedFunctionData ??
		(rawFunctionData && contract ? decodeFunctionData({ abi: contract?.abi, data: rawFunctionData }) : undefined)

	if (!decodedFunction?.args) throw new Error('Could not decode function data')

	// Get the function ABI to map argument names
	const functionAbi = contract?.abi.find(
		(item) => item.type === 'function' && item.name === decodedFunction.functionName,
	)

	if (!functionAbi || functionAbi.type !== 'function') {
		throw new Error(`Function ${decodedFunction.functionName} not found in contract ABI`)
	}

	// Map actual arguments by name
	const actualNamedArgs: Record<string, unknown> = {}
	functionAbi.inputs.forEach((input, index) => {
		if (input.name && decodedFunction.args && index < decodedFunction.args.length) {
			actualNamedArgs[input.name] = decodedFunction.args[index]
		}
	})

	// Check if all expected arguments match
	const expectedArgNames = Object.keys(expectedArgs)
	const allMatch = expectedArgNames.every((argName) => {
		if (!(argName in actualNamedArgs)) {
			return false // Argument name not found in function
		}
		return actualNamedArgs[argName] === expectedArgs[argName]
	})

	return {
		pass: allMatch,
		actual: actualNamedArgs,
		expected: expectedArgs,
		message: () =>
			allMatch
				? 'Expected transaction not to call function with the specified arguments'
				: 'Expected transaction to call function with the specified arguments',
	}
}