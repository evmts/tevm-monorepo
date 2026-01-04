/**
 * Contract type definitions (native implementations replacing viem types)
 *
 * These types provide the same functionality as viem's contract types
 * but are implemented using abitype primitives, allowing us to reduce
 * the viem dependency surface.
 */

import type {
	Abi,
	AbiStateMutability,
	ExtractAbiFunctionNames,
	ExtractAbiFunction,
	AbiParametersToPrimitiveTypes,
	AbiFunction,
} from 'abitype'

/**
 * Extracts function names from an ABI that match the given state mutability.
 *
 * This is a native replacement for viem's ContractFunctionName type.
 * It extracts all function names from an ABI, optionally filtered by mutability.
 *
 * @template TAbi - The contract ABI type
 * @template TMutability - The state mutability to filter by (default: all)
 *
 * @example
 * ```typescript
 * import { ContractFunctionName } from '@tevm/utils'
 *
 * const abi = [
 *   { type: 'function', name: 'balanceOf', stateMutability: 'view', inputs: [], outputs: [] },
 *   { type: 'function', name: 'transfer', stateMutability: 'nonpayable', inputs: [], outputs: [] },
 * ] as const
 *
 * // All function names
 * type AllFunctions = ContractFunctionName<typeof abi> // 'balanceOf' | 'transfer'
 *
 * // Only view functions
 * type ViewFunctions = ContractFunctionName<typeof abi, 'view'> // 'balanceOf'
 * ```
 */
export type ContractFunctionName<
	TAbi extends Abi | readonly unknown[] = Abi,
	TMutability extends AbiStateMutability = AbiStateMutability
> = ExtractAbiFunctionNames<
	TAbi extends Abi ? TAbi : Abi,
	TMutability
> extends infer FunctionName extends string
	? [FunctionName] extends [never]
		? string
		: FunctionName
	: string

/**
 * Helper type: Checks if a type is a union type
 * @internal
 */
type IsUnion<T, U extends T = T> = (T extends unknown ? (U extends T ? false : true) : never) extends false
	? false
	: true

/**
 * Helper type: Converts a union to a tuple
 * @internal
 */
type UnionToTuple<T, L = LastOfUnion<T>, N = [T] extends [never] ? true : false> = true extends N
	? []
	: Push<UnionToTuple<Exclude<T, L>>, L>

type LastOfUnion<T> = UnionToIntersection<T extends unknown ? () => T : never> extends () => infer R ? R : never

type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never

type Push<T extends unknown[], V> = [...T, V]

/**
 * Helper type: Extracts ABI function for specific args (handles overloads)
 * @internal
 */
type ExtractAbiFunctionForArgs<
	TAbi extends Abi,
	TMutability extends AbiStateMutability,
	TFunctionName extends ContractFunctionName<TAbi, TMutability>,
	TArgs extends ContractFunctionArgs<TAbi, TMutability, TFunctionName>
> = ExtractAbiFunction<TAbi, TFunctionName, TMutability> extends infer TAbiFunction extends AbiFunction
	? IsUnion<TAbiFunction> extends true
		? UnionToTuple<TAbiFunction> extends infer TAbiFunctions extends readonly AbiFunction[]
			? { [K in keyof TAbiFunctions]: CheckArgs<TAbiFunctions[K], TArgs> }[number]
			: never
		: TAbiFunction
	: never

type CheckArgs<
	TAbiFunction extends AbiFunction,
	TArgs,
	TTargetArgs extends AbiParametersToPrimitiveTypes<TAbiFunction['inputs'], 'inputs'> = AbiParametersToPrimitiveTypes<
		TAbiFunction['inputs'],
		'inputs'
	>
> = (readonly [] extends TArgs ? readonly [] : TArgs) extends TTargetArgs ? TAbiFunction : never

/**
 * Extracts the argument types for a contract function.
 *
 * This is a native replacement for viem's ContractFunctionArgs type.
 * It extracts the input parameter types for a specific function from an ABI.
 *
 * @template TAbi - The contract ABI type
 * @template TMutability - The state mutability to filter by (default: all)
 * @template TFunctionName - The function name to extract args for
 *
 * @example
 * ```typescript
 * import { ContractFunctionArgs } from '@tevm/utils'
 *
 * const abi = [
 *   {
 *     type: 'function',
 *     name: 'transfer',
 *     stateMutability: 'nonpayable',
 *     inputs: [
 *       { name: 'to', type: 'address' },
 *       { name: 'amount', type: 'uint256' }
 *     ],
 *     outputs: [{ type: 'bool' }]
 *   }
 * ] as const
 *
 * type TransferArgs = ContractFunctionArgs<typeof abi, 'nonpayable', 'transfer'>
 * // Result: readonly [`0x${string}`, bigint]
 * ```
 */
export type ContractFunctionArgs<
	TAbi extends Abi | readonly unknown[] = Abi,
	TMutability extends AbiStateMutability = AbiStateMutability,
	TFunctionName extends ContractFunctionName<TAbi, TMutability> = ContractFunctionName<TAbi, TMutability>
> = AbiParametersToPrimitiveTypes<
	ExtractAbiFunction<TAbi extends Abi ? TAbi : Abi, TFunctionName, TMutability>['inputs'],
	'inputs'
> extends infer TArgs
	? [TArgs] extends [never]
		? readonly unknown[]
		: TArgs
	: readonly unknown[]

/**
 * Extracts the return type for a contract function.
 *
 * This is a native replacement for viem's ContractFunctionReturnType type.
 * It extracts the output types for a specific function from an ABI.
 *
 * @template TAbi - The contract ABI type
 * @template TMutability - The state mutability to filter by (default: all)
 * @template TFunctionName - The function name to extract return type for
 * @template TArgs - The function arguments (for overload resolution)
 *
 * @example
 * ```typescript
 * import { ContractFunctionReturnType } from '@tevm/utils'
 *
 * const abi = [
 *   {
 *     type: 'function',
 *     name: 'balanceOf',
 *     stateMutability: 'view',
 *     inputs: [{ name: 'account', type: 'address' }],
 *     outputs: [{ type: 'uint256' }]
 *   }
 * ] as const
 *
 * type BalanceResult = ContractFunctionReturnType<typeof abi, 'view', 'balanceOf'>
 * // Result: bigint
 * ```
 */
export type ContractFunctionReturnType<
	TAbi extends Abi | readonly unknown[] = Abi,
	TMutability extends AbiStateMutability = AbiStateMutability,
	TFunctionName extends ContractFunctionName<TAbi, TMutability> = ContractFunctionName<TAbi, TMutability>,
	TArgs extends ContractFunctionArgs<TAbi, TMutability, TFunctionName> = ContractFunctionArgs<
		TAbi,
		TMutability,
		TFunctionName
	>
> = TAbi extends Abi
	? Abi extends TAbi
		? unknown
		: AbiParametersToPrimitiveTypes<
					ExtractAbiFunctionForArgs<TAbi, TMutability, TFunctionName, TArgs>['outputs']
			  > extends infer TTypes
			? TTypes extends readonly []
				? void
				: TTypes extends readonly [infer TType]
					? TType
					: TTypes
			: never
	: unknown
