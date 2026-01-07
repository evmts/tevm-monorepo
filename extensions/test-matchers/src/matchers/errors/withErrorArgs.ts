import {
	type Abi,
	type AbiParameter,
	type AbiParametersToPrimitiveTypes,
	type ContractErrorName,
	type ExtractAbiError,
	decodeErrorResult,
} from '@tevm/utils'
import { parseChainArgs } from '../../chainable/chainable.js'
import type { ChainState, MatcherResult } from '../../chainable/types.js'
import type { ToBeRevertedWithState } from './types.js'

export const withErrorArgs = <
	TAbi extends Abi | undefined = Abi | undefined,
	TErrorName extends TAbi extends Abi ? ContractErrorName<TAbi> : never = TAbi extends Abi
		? ContractErrorName<TAbi>
		: never,
	TInputs extends readonly AbiParameter[] = TAbi extends Abi
		? ExtractAbiError<TAbi, TErrorName> extends { inputs: infer U extends readonly AbiParameter[] }
			? U
			: readonly AbiParameter[]
		: never,
>(
	_received: unknown,
	...argsAndChainState: readonly [...AbiParametersToPrimitiveTypes<TInputs>, ChainState<unknown, ToBeRevertedWithState>]
): MatcherResult => {
	const {
		args,
		chainState: { previousState },
	} = parseChainArgs<unknown, ToBeRevertedWithState>(argsAndChainState)

	if (!previousState || !('contract' in previousState))
		throw new Error('withErrorArgs() requires a contract with abi and error name')

	const { contract, decodedRevertData, rawRevertData } = previousState
	if (!contract?.abi) throw new Error('Contract with ABI is required for error decoding')
	const decodedRevert =
		decodedRevertData ?? (rawRevertData ? decodeErrorResult({ abi: contract.abi, data: rawRevertData }) : undefined)
	const decodedArgs = decodedRevert?.args
	if (!decodedArgs) throw new Error('Could not decode revert data')

	const argsMatched = args.length <= decodedArgs.length && args.every((arg, i) => decodedArgs[i] === arg)

	return {
		pass: argsMatched,
		actual: decodedArgs,
		expected: args,
		message: () =>
			argsMatched
				? 'Expected transaction not to revert with the specified arguments'
				: 'Expected transaction to revert with the specified arguments',
	}
}
