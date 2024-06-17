import type { Abi, EncodeDeployDataParameters, Hex, ParseAbi } from '@tevm/utils'

/**
 * Inferred arguments for a contract deployment
 */
export type DeployArgs<
	THumanReadableAbi extends string[] | readonly string[],
	TBytecode extends Hex | undefined = undefined,
	TAbi extends ParseAbi<THumanReadableAbi> = ParseAbi<THumanReadableAbi>,
	THasConstructor = TAbi extends Abi
		? Abi extends TAbi
			? true
			: [Extract<TAbi[number], { type: 'constructor' }>] extends [never]
				? false
				: true
		: true,
> = THasConstructor extends false
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
