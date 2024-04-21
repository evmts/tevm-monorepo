import type { Script } from '@tevm/contract'
import { Precompile } from './Precompile.js'

export const definePrecompile = <TName extends string, THumanReadableAbi extends readonly string[]>({
	contract,
	call,
}: Pick<
	Precompile<TName, THumanReadableAbi, ReturnType<Script<TName, THumanReadableAbi>['withAddress']>>,
	'contract' | 'call'
>): Precompile<TName, THumanReadableAbi, ReturnType<Script<TName, THumanReadableAbi>['withAddress']>> => {
	const wrappedCall = call
	class PrecompileImplementation extends Precompile<TName, THumanReadableAbi> {
		contract = contract
		call = wrappedCall
	}
	return new PrecompileImplementation()
}
