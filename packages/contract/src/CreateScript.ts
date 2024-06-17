import type { Abi, Address, EncodeDeployDataParameters, Hex, ParseAbi } from '@tevm/utils'
import type { Contract } from './Contract.js'

/**
 * Creates a deployless instance of a contract
 * Can be used to execute code that isn't deployed in tevm
 * or [viem](https://viem.sh/docs/actions/public/call#deployless-calls)
 */
export type CreateScript<
	TName extends string,
	THumanReadableAbi extends string[] | readonly string[],
	TAddress extends Address | undefined = undefined,
	TBytecode extends Hex | undefined = undefined,
	TAbi extends ParseAbi<THumanReadableAbi> = ParseAbi<THumanReadableAbi>,
	THasConstructor = TAbi extends Abi
		? Abi extends TAbi
			? true
			: [Extract<TAbi[number], { type: 'constructor' }>] extends [never]
				? false
				: true
		: true,
> = (
	...args: THasConstructor extends false
		? TBytecode extends Hex
			? // allow no args to be passed in if no args
				[] | [{}] | [Omit<EncodeDeployDataParameters<TAbi>, 'bytecode' | 'abi'> & { bytecode?: Hex }]
			: // if only bytecode is needed require only that
				[{ bytecode: Hex } | Omit<EncodeDeployDataParameters<TAbi>, 'abi'>]
		: // otherwise require encoding args and bytecode if necessary
			[
				({ data: Hex } | Omit<EncodeDeployDataParameters<TAbi>, 'bytecode' | 'abi'>) & TBytecode extends Hex
					? {}
					: { bytecode: Hex },
			]
) => Contract<TName, THumanReadableAbi, TAddress, Hex, Hex, Hex>
