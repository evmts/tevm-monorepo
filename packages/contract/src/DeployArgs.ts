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
			[] | [{ bytecode?: Hex }]
		: // if only bytecode is needed require only that
			[{ bytecode: Hex }]
	: // otherwise require encoding args and bytecode if necessary
		TBytecode extends Hex
		? [{ constructorArgs: EncodeDeployDataParameters<TAbi>['args'] }]
		: [{ constructorArgs: EncodeDeployDataParameters<TAbi>['args']; bytecode: Hex }]
