import {
	type Abi,
	type AbiError,
	type AbiParameter,
	type ContractErrorName,
	type ExtractAbiError,
	decodeErrorResult,
} from '@tevm/utils'
import { assert } from 'vitest'
import type { ChainState, MatcherResult } from '../../chainable/types.js'
import type { AbiInputsToNamedArgs } from '../../common/types.js'
import type { ToBeRevertedWithState } from './types.js'

export const withErrorNamedArgs = <
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
	expectedArgs: Partial<AbiInputsToNamedArgs<TInputs>>,
	chainState?: ChainState<unknown, ToBeRevertedWithState>,
): MatcherResult => {
	assert(chainState, 'Internal error: no chain state found')
	const { previousState } = chainState

	if (!previousState || !('contract' in previousState))
		throw new Error('withErrorNamedArgs() requires a contract with abi and error name')

	const { contract, decodedRevertData, rawRevertData } = previousState
	if (!contract?.abi) throw new Error('Contract with ABI is required for error decoding')
	const decodedRevert =
		decodedRevertData ?? (rawRevertData ? decodeErrorResult({ abi: contract.abi, data: rawRevertData }) : undefined)
	const decodedArgs = decodedRevert?.args
	if (!decodedArgs || !decodedRevert) throw new Error('Could not decode revert data')
	const abiItem = 'abiItem' in decodedRevert ? decodedRevert.abiItem : undefined
	if (!abiItem || abiItem.type !== 'error') throw new Error('Could not get error ABI item')
	const namedArgs = (abiItem as AbiError).inputs.reduce(
		(acc, input, index) => {
			acc[input.name ?? ''] = decodedArgs[index]
			return acc
		},
		{} as Record<string, unknown>,
	)

	const argsMatched = Object.keys(expectedArgs).every(
		(key) => key in namedArgs && namedArgs[key] === expectedArgs[key as keyof typeof expectedArgs],
	)

	return {
		pass: argsMatched,
		actual: namedArgs,
		expected: expectedArgs,
		message: () =>
			argsMatched
				? 'Expected transaction not to revert with the specified arguments'
				: 'Expected transaction to revert with the specified arguments',
	}
}
