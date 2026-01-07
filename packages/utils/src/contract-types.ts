/**
 * Contract type definitions (native implementations replacing viem types)
 *
 * These types provide the same functionality as viem's contract types
 * but are implemented using abitype primitives, allowing us to reduce
 * the viem dependency surface.
 */

import type {
	Abi,
	AbiFunction,
	AbiParametersToPrimitiveTypes,
	AbiStateMutability,
	ExtractAbiFunction,
	ExtractAbiFunctionNames,
} from 'abitype'

import type { Hex } from './hex-types.js'

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

/**
 * Extracts the constructor argument types from a contract ABI.
 *
 * This is a native replacement for viem's ContractConstructorArgs type.
 * It extracts the input parameter types for the constructor from an ABI.
 *
 * @template TAbi - The contract ABI type
 *
 * @example
 * ```typescript
 * import { ContractConstructorArgs } from '@tevm/utils'
 *
 * const abi = [
 *   {
 *     type: 'constructor',
 *     inputs: [
 *       { name: 'owner', type: 'address' },
 *       { name: 'initialSupply', type: 'uint256' }
 *     ]
 *   }
 * ] as const
 *
 * type ConstructorArgs = ContractConstructorArgs<typeof abi>
 * // Result: readonly [`0x${string}`, bigint]
 * ```
 */
export type ContractConstructorArgs<TAbi extends Abi | readonly unknown[] = Abi> = AbiParametersToPrimitiveTypes<
	Extract<
		(TAbi extends Abi ? TAbi : Abi)[number],
		{ type: 'constructor' }
	>['inputs'],
	'inputs'
> extends infer TArgs
	? [TArgs] extends [never]
		? readonly unknown[]
		: TArgs
	: readonly unknown[]

/**
 * Helper type: Extracts the function args structure from an ABI function.
 *
 * This mirrors viem's `GetFunctionArgs` type.
 * It returns `{ args: ... }` when the function has inputs, or `{ args?: never }` when no inputs.
 *
 * @internal
 */
type GetFunctionArgs<
	TAbi extends Abi | readonly unknown[],
	TFunctionName extends string,
	TAbiFunction extends AbiFunction = TAbi extends Abi ? ExtractAbiFunction<TAbi, TFunctionName> : AbiFunction,
	TArgs = AbiParametersToPrimitiveTypes<TAbiFunction['inputs'], 'inputs'>,
	FailedToParseArgs = ([TArgs] extends [never] ? true : false) | (readonly unknown[] extends TArgs ? true : false)
> = true extends FailedToParseArgs
	? {
			/**
			 * Arguments to pass contract method
			 *
			 * Use a [const assertion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) on {@link abi} for type inference.
			 */
			args?: readonly unknown[]
		}
	: TArgs extends readonly []
		? { args?: never }
		: { /** Arguments to pass contract method */ args: TArgs }

/**
 * Parameters for encoding function data.
 *
 * This is a native replacement for viem's `EncodeFunctionDataParameters` type.
 * It provides the type signature for `encodeFunctionData` parameters, including
 * the ABI, function name, and function arguments.
 *
 * @template TAbi - The contract ABI type
 * @template TFunctionName - The function name to encode
 *
 * @example
 * ```typescript
 * import { EncodeFunctionDataParameters } from '@tevm/utils'
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
 * type TransferParams = EncodeFunctionDataParameters<typeof abi, 'transfer'>
 * // Result: { abi: typeof abi; functionName?: 'transfer'; args: readonly [`0x${string}`, bigint] }
 * ```
 */
export type EncodeFunctionDataParameters<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string | undefined = string,
	_FunctionName = TAbi extends Abi
		? TFunctionName extends string
			? TFunctionName
			: ExtractAbiFunctionNames<TAbi>
		: TFunctionName
> = {
	functionName?: _FunctionName
} & (TFunctionName extends string
	? { abi: TAbi } & GetFunctionArgs<TAbi, TFunctionName>
	: _FunctionName extends string
		? { abi: [TAbi[number]] } & GetFunctionArgs<TAbi, _FunctionName>
		: never)

/**
 * Helper type: Prettify flattens mapped types for better display.
 * @internal
 */
type Prettify<T> = {
	[K in keyof T]: T[K]
} & {}

/**
 * Helper type: Evaluates union types by applying Prettify to object types.
 * @internal
 */
type UnionEvaluate<T> = T extends object ? Prettify<T> : T

/**
 * Parameters for encoding contract deployment data.
 *
 * This is a native replacement for viem's `EncodeDeployDataParameters` type.
 * It provides the type signature for `encodeDeployData` parameters, including
 * the ABI, bytecode, and constructor arguments.
 *
 * @template TAbi - The contract ABI type
 * @template THasConstructor - Whether the ABI has a constructor
 * @template TAllArgs - The constructor argument types
 *
 * @example
 * ```typescript
 * import { EncodeDeployDataParameters } from '@tevm/utils'
 *
 * const abi = [
 *   {
 *     type: 'constructor',
 *     inputs: [
 *       { name: 'owner', type: 'address' },
 *       { name: 'initialSupply', type: 'uint256' }
 *     ]
 *   }
 * ] as const
 *
 * type DeployParams = EncodeDeployDataParameters<typeof abi>
 * // Result: { abi: typeof abi; bytecode: Hex; args: readonly [`0x${string}`, bigint] }
 * ```
 *
 * @example
 * ```typescript
 * // Contract with no constructor
 * const abiNoConstructor = [
 *   { type: 'function', name: 'foo', inputs: [], outputs: [], stateMutability: 'view' }
 * ] as const
 *
 * type DeployParamsNoConstructor = EncodeDeployDataParameters<typeof abiNoConstructor>
 * // Result: { abi: typeof abi; bytecode: Hex; args?: undefined }
 * ```
 */
export type EncodeDeployDataParameters<
	TAbi extends Abi | readonly unknown[] = Abi,
	THasConstructor = TAbi extends Abi
		? Abi extends TAbi
			? true
			: [Extract<TAbi[number], { type: 'constructor' }>] extends [never]
				? false
				: true
		: true,
	TAllArgs = ContractConstructorArgs<TAbi>
> = {
	/** Contract ABI */
	abi: TAbi
	/** Contract bytecode */
	bytecode: Hex
} & UnionEvaluate<
	THasConstructor extends false
		? {
				/** Constructor arguments (not applicable - no constructor) */
				args?: undefined
			}
		: readonly [] extends TAllArgs
			? {
					/** Constructor arguments (optional - constructor has no inputs) */
					args?: TAllArgs | undefined
				}
			: {
					/** Constructor arguments */
					args: TAllArgs
				}
>

/**
 * Return type for decoding function results from a contract call.
 *
 * This is a native replacement for viem's `DecodeFunctionResultReturnType` type.
 * It provides the return type when decoding the output of a contract function call.
 *
 * This type is essentially an alias for `ContractFunctionReturnType` with sensible defaults,
 * matching viem's implementation pattern.
 *
 * @template TAbi - The contract ABI type
 * @template TFunctionName - The function name to decode results for
 * @template TArgs - The function arguments (for overload resolution)
 *
 * @example
 * ```typescript
 * import { DecodeFunctionResultReturnType } from '@tevm/utils'
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
 * type BalanceResult = DecodeFunctionResultReturnType<typeof abi, 'balanceOf'>
 * // Result: bigint
 * ```
 *
 * @example
 * ```typescript
 * // With multiple outputs
 * const abi = [
 *   {
 *     type: 'function',
 *     name: 'getReserves',
 *     stateMutability: 'view',
 *     inputs: [],
 *     outputs: [
 *       { type: 'uint112', name: 'reserve0' },
 *       { type: 'uint112', name: 'reserve1' },
 *       { type: 'uint32', name: 'blockTimestampLast' }
 *     ]
 *   }
 * ] as const
 *
 * type ReservesResult = DecodeFunctionResultReturnType<typeof abi, 'getReserves'>
 * // Result: readonly [bigint, bigint, number]
 * ```
 */
export type DecodeFunctionResultReturnType<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends ContractFunctionName<TAbi> | undefined = ContractFunctionName<TAbi>,
	TArgs extends ContractFunctionArgs<
		TAbi,
		AbiStateMutability,
		TFunctionName extends ContractFunctionName<TAbi> ? TFunctionName : ContractFunctionName<TAbi>
	> = ContractFunctionArgs<
		TAbi,
		AbiStateMutability,
		TFunctionName extends ContractFunctionName<TAbi> ? TFunctionName : ContractFunctionName<TAbi>
	>
> = ContractFunctionReturnType<
	TAbi,
	AbiStateMutability,
	TFunctionName extends ContractFunctionName<TAbi> ? TFunctionName : ContractFunctionName<TAbi>,
	TArgs
>

// ========================================================================
// Event Types - Native implementations replacing viem event types
// ========================================================================

import type {
	AbiEvent,
	AbiParameter,
	AbiParameterToPrimitiveType,
	ExtractAbiEvent,
	ExtractAbiEventNames,
} from 'abitype'

import type { Address } from './address-types.js'
import type { BlockNumber, BlockTag } from './block-types.js'

/**
 * Extracts event names from an ABI.
 *
 * This is a native replacement for viem's ContractEventName type.
 *
 * @template TAbi - The contract ABI type
 *
 * @example
 * ```typescript
 * import { ContractEventName } from '@tevm/utils'
 *
 * const abi = [
 *   { type: 'event', name: 'Transfer', inputs: [] },
 *   { type: 'event', name: 'Approval', inputs: [] },
 * ] as const
 *
 * type EventNames = ContractEventName<typeof abi> // 'Transfer' | 'Approval'
 * ```
 */
export type ContractEventName<TAbi extends Abi | readonly unknown[] = Abi> =
	ExtractAbiEventNames<TAbi extends Abi ? TAbi : Abi> extends infer TEventName extends string
		? [TEventName] extends [never]
			? string
			: TEventName
		: string

/**
 * Helper type: Filters an array of types to only include those matching a pattern.
 * @internal
 */
type FilterByPattern<
	T extends readonly unknown[],
	P,
	Acc extends readonly unknown[] = []
> = T extends readonly [infer F, ...infer Rest extends readonly unknown[]]
	? F extends P
		? FilterByPattern<Rest, P, readonly [...Acc, F]>
		: FilterByPattern<Rest, P, Acc>
	: Acc

/**
 * Helper type: Checks if a parameter has an empty or missing name.
 * @internal
 */
type HasUnnamedParameter<T extends readonly AbiParameter[]> =
	T extends readonly [infer Head extends AbiParameter, ...infer Tail extends readonly AbiParameter[]]
		? Head extends { name: string }
			? Head['name'] extends ''
				? true
				: HasUnnamedParameter<Tail>
			: true
		: false

/**
 * Helper type: Makes all properties required.
 * @internal
 */
type ExactRequired<T> = {
	[K in keyof T]-?: Exclude<T[K], undefined>
}

/**
 * Helper type: Conditionally makes properties required.
 * @internal
 */
type MaybeRequired<T, TRequired extends boolean> = TRequired extends true
	? ExactRequired<T>
	: T

/**
 * Log topic type for event filtering.
 * @internal
 */
type LogTopic = Hex | Hex[] | null

/**
 * Converts a log topic to its primitive type representation.
 * @internal
 */
type LogTopicType<
	TPrimitiveType = Hex,
	TTopic extends LogTopic = LogTopic
> = TTopic extends Hex
	? TPrimitiveType
	: TTopic extends Hex[]
		? TPrimitiveType[]
		: TTopic extends null
			? null
			: never

/**
 * Event parameter options for type extraction.
 * @internal
 */
type EventParameterOptions = {
	EnableUnion?: boolean
	IndexedOnly?: boolean
	Required?: boolean
}

/**
 * Default options for event parameter extraction.
 * @internal
 */
type DefaultEventParameterOptions = {
	EnableUnion: true
	IndexedOnly: true
	Required: false
}

/**
 * Converts a single ABI event parameter to its primitive type.
 * @internal
 */
type AbiEventParameterToPrimitiveType<
	TAbiParameter extends AbiParameter,
	TOptions extends EventParameterOptions = DefaultEventParameterOptions,
	TType = AbiParameterToPrimitiveType<TAbiParameter>
> = TOptions['EnableUnion'] extends true ? LogTopicType<TType> : TType

/**
 * Converts ABI event parameters to their primitive types.
 *
 * This handles:
 * - Filtering indexed vs non-indexed parameters
 * - Named vs unnamed parameters (array vs object return)
 * - Optional vs required parameters
 *
 * @internal
 */
type AbiEventParametersToPrimitiveTypes<
	TAbiParameters extends readonly AbiParameter[],
	TOptions extends EventParameterOptions = DefaultEventParameterOptions,
	TFiltered extends readonly AbiParameter[] = FilterByPattern<
		TAbiParameters,
		TOptions['IndexedOnly'] extends true ? { indexed: true } : AbiParameter
	> extends infer F extends readonly AbiParameter[]
		? F
		: readonly []
> = TAbiParameters extends readonly []
	? readonly []
	: HasUnnamedParameter<TFiltered> extends true
		? // Has unnamed parameters - return as tuple/array
			| readonly [...{ [K in keyof TFiltered]: AbiEventParameterToPrimitiveType<TFiltered[K], TOptions> }]
			| (TOptions['Required'] extends true ? never : readonly [])
		: // All named parameters - return as object
			Prettify<
				MaybeRequired<
					{
						[Parameter in TFiltered[number] as Parameter extends { name: infer Name extends string }
							? Name
							: never]?:
							| AbiEventParameterToPrimitiveType<Parameter, TOptions>
							| undefined
					},
					TOptions['Required'] extends boolean ? TOptions['Required'] : false
				>
			>

/**
 * Extracts the argument types for an event.
 *
 * This is a native replacement for viem's GetEventArgs type.
 * It extracts the indexed input parameter types for a specific event from an ABI.
 *
 * @template TAbi - The contract ABI type
 * @template TEventName - The event name to extract args for
 * @template TConfig - Configuration options for type extraction
 *
 * @example
 * ```typescript
 * import { GetEventArgs } from '@tevm/utils'
 *
 * const abi = [
 *   {
 *     type: 'event',
 *     name: 'Transfer',
 *     inputs: [
 *       { name: 'from', type: 'address', indexed: true },
 *       { name: 'to', type: 'address', indexed: true },
 *       { name: 'value', type: 'uint256', indexed: false }
 *     ]
 *   }
 * ] as const
 *
 * type TransferArgs = GetEventArgs<typeof abi, 'Transfer'>
 * // Result: { from?: `0x${string}` | null; to?: `0x${string}` | null }
 * ```
 */
export type GetEventArgs<
	TAbi extends Abi | readonly unknown[],
	TEventName extends string,
	TConfig extends EventParameterOptions = DefaultEventParameterOptions,
	TAbiEvent extends AbiEvent & { type: 'event' } = TAbi extends Abi
		? ExtractAbiEvent<TAbi, TEventName>
		: AbiEvent & { type: 'event' },
	TArgs = AbiEventParametersToPrimitiveTypes<TAbiEvent['inputs'], TConfig>
> = TArgs extends Record<PropertyKey, never>
	? readonly unknown[] | Record<string, unknown>
	: TArgs

/**
 * Helper type: Extracts event args from ABI, handling undefined cases.
 *
 * This is a native replacement for viem's MaybeExtractEventArgsFromAbi type.
 *
 * @internal
 */
export type MaybeExtractEventArgsFromAbi<
	TAbi extends Abi | readonly unknown[] | undefined,
	TEventName extends string | undefined
> = TAbi extends Abi | readonly unknown[]
	? TEventName extends string
		? GetEventArgs<TAbi, TEventName>
		: undefined
	: undefined

/**
 * Helper type: Extracts event name from AbiEvent, handling undefined.
 *
 * @internal
 */
export type MaybeAbiEventName<TAbiEvent extends AbiEvent | undefined> =
	TAbiEvent extends AbiEvent ? TAbiEvent['name'] : undefined

/**
 * Parameters for creating an event filter.
 *
 * This is a native replacement for viem's CreateEventFilterParameters type.
 * It provides the type signature for creating event filters with optional
 * block range and event arguments filtering.
 *
 * @template TAbiEvent - The ABI event type
 * @template TAbiEvents - The array of ABI events
 * @template TStrict - Whether to use strict mode
 * @template TFromBlock - The starting block
 * @template TToBlock - The ending block
 * @template TEventName - The event name
 * @template TArgs - The event arguments for filtering
 *
 * @example
 * ```typescript
 * import { CreateEventFilterParameters } from '@tevm/utils'
 *
 * const abi = [
 *   {
 *     type: 'event',
 *     name: 'Transfer',
 *     inputs: [
 *       { name: 'from', type: 'address', indexed: true },
 *       { name: 'to', type: 'address', indexed: true },
 *       { name: 'value', type: 'uint256', indexed: false }
 *     ]
 *   }
 * ] as const
 *
 * type FilterParams = CreateEventFilterParameters<
 *   typeof abi[0], // event
 *   typeof abi,    // events array
 *   true,          // strict mode
 *   'latest',      // fromBlock
 *   'latest'       // toBlock
 * >
 * ```
 */
export type CreateEventFilterParameters<
	TAbiEvent extends AbiEvent | undefined = undefined,
	TAbiEvents extends
		| readonly AbiEvent[]
		| readonly unknown[]
		| undefined = TAbiEvent extends AbiEvent ? [TAbiEvent] : undefined,
	TStrict extends boolean | undefined = undefined,
	TFromBlock extends BlockNumber | BlockTag | undefined = undefined,
	TToBlock extends BlockNumber | BlockTag | undefined = undefined,
	TEventName extends string | undefined = MaybeAbiEventName<TAbiEvent>,
	TArgs extends
		| MaybeExtractEventArgsFromAbi<TAbiEvents, TEventName>
		| undefined = undefined
> = {
	/** Contract address(es) to filter events from */
	address?: Address | Address[] | undefined
	/** Block number or tag to start filtering from */
	fromBlock?: TFromBlock | BlockNumber | BlockTag | undefined
	/** Block number or tag to stop filtering at */
	toBlock?: TToBlock | BlockNumber | BlockTag | undefined
} & (MaybeExtractEventArgsFromAbi<TAbiEvents, TEventName> extends infer TEventFilterArgs
	?
		| {
				/** Event arguments to filter by */
				args: TEventFilterArgs | (TArgs extends TEventFilterArgs ? TArgs : never)
				/** The event to filter */
				event: TAbiEvent
				/** Array of events (mutually exclusive with event) */
				events?: undefined
				/**
				 * Whether or not the logs must match the indexed/non-indexed arguments on `event`.
				 * @default false
				 */
				strict?: TStrict | undefined
			}
		| {
				args?: undefined
				event?: TAbiEvent | undefined
				events?: undefined
				strict?: TStrict | undefined
			}
		| {
				args?: undefined
				event?: undefined
				events: TAbiEvents | undefined
				strict?: TStrict | undefined
			}
		| {
				args?: undefined
				event?: undefined
				events?: undefined
				strict?: undefined
			}
	: {
			args?: undefined
			event?: undefined
			events?: undefined
			strict?: undefined
		})

// ========================================================================
// Error Types - Native implementations replacing viem error types
// ========================================================================

import type {
	ExtractAbiError,
	ExtractAbiErrorNames,
} from 'abitype'

/**
 * Extracts error names from an ABI.
 *
 * This is a native replacement for viem's ContractErrorName type.
 * It extracts all error names from an ABI.
 *
 * @template TAbi - The contract ABI type
 *
 * @example
 * ```typescript
 * import { ContractErrorName } from '@tevm/utils'
 *
 * const abi = [
 *   { type: 'error', name: 'InsufficientBalance', inputs: [] },
 *   { type: 'error', name: 'Unauthorized', inputs: [] },
 * ] as const
 *
 * type ErrorNames = ContractErrorName<typeof abi> // 'InsufficientBalance' | 'Unauthorized'
 * ```
 */
export type ContractErrorName<TAbi extends Abi | readonly unknown[] = Abi> =
	ExtractAbiErrorNames<TAbi extends Abi ? TAbi : Abi> extends infer TErrorName extends string
		? [TErrorName] extends [never]
			? string
			: TErrorName
		: string

/**
 * Extracts the argument types for a contract error.
 *
 * This is a native replacement for viem's ContractErrorArgs type.
 * It extracts the input parameter types for a specific error from an ABI.
 *
 * @template TAbi - The contract ABI type
 * @template TErrorName - The error name to extract args for
 *
 * @example
 * ```typescript
 * import { ContractErrorArgs } from '@tevm/utils'
 *
 * const abi = [
 *   {
 *     type: 'error',
 *     name: 'InsufficientBalance',
 *     inputs: [
 *       { name: 'balance', type: 'uint256' },
 *       { name: 'required', type: 'uint256' }
 *     ]
 *   }
 * ] as const
 *
 * type ErrorArgs = ContractErrorArgs<typeof abi, 'InsufficientBalance'>
 * // Result: readonly [bigint, bigint]
 * ```
 */
export type ContractErrorArgs<
	TAbi extends Abi | readonly unknown[] = Abi,
	TErrorName extends ContractErrorName<TAbi> = ContractErrorName<TAbi>
> = AbiParametersToPrimitiveTypes<
	ExtractAbiError<TAbi extends Abi ? TAbi : Abi, TErrorName>['inputs']
> extends infer TArgs
	? [TArgs] extends [never]
		? readonly unknown[]
		: TArgs
	: readonly unknown[]

// Re-export ExtractAbiError from abitype for convenience
export type { ExtractAbiError } from 'abitype'

// ========================================================================
// DecodeErrorResult Types - Native implementation replacing viem type
// ========================================================================

/**
 * Represents any item from an ABI (function, event, error, constructor, fallback, receive).
 * This is equivalent to `Abi[number]` in viem.
 * @internal
 */
type AbiItem = Abi[number]

/**
 * Helper type: Checks if a type is narrowable (specific) vs. wide.
 * Returns true if TAbi is a specific ABI type, false if it's just `Abi`.
 * @internal
 */
type IsNarrowable<T, TBase> = [T] extends [never]
	? false
	: [TBase] extends [T]
		? false
		: true

/**
 * Return type for decoding error results from a reverted contract call.
 *
 * This is a native replacement for viem's `DecodeErrorResultReturnType` type.
 * It provides the return type when decoding the error output of a reverted contract call.
 *
 * When the ABI is narrow (specific), this returns a union of possible error structures.
 * When the ABI is wide (generic `Abi`), this returns a generic error structure.
 *
 * @template TAbi - The contract ABI type
 * @template TErrorName - The error name(s) to include (defaults to all error names in the ABI)
 *
 * @example
 * ```typescript
 * import { DecodeErrorResultReturnType } from '@tevm/utils'
 *
 * const abi = [
 *   {
 *     type: 'error',
 *     name: 'InsufficientBalance',
 *     inputs: [
 *       { name: 'balance', type: 'uint256' },
 *       { name: 'required', type: 'uint256' }
 *     ]
 *   },
 *   {
 *     type: 'error',
 *     name: 'Unauthorized',
 *     inputs: []
 *   }
 * ] as const
 *
 * type ErrorResult = DecodeErrorResultReturnType<typeof abi>
 * // Result:
 * // | { abiItem: ExtractAbiError<typeof abi, 'InsufficientBalance'>; args: readonly [bigint, bigint]; errorName: 'InsufficientBalance' }
 * // | { abiItem: ExtractAbiError<typeof abi, 'Unauthorized'>; args: readonly []; errorName: 'Unauthorized' }
 * ```
 *
 * @example
 * ```typescript
 * // With generic Abi
 * import { Abi } from 'abitype'
 * import { DecodeErrorResultReturnType } from '@tevm/utils'
 *
 * type GenericResult = DecodeErrorResultReturnType<Abi>
 * // Result: { abiItem: AbiItem; args: readonly unknown[] | undefined; errorName: string }
 * ```
 */
export type DecodeErrorResultReturnType<
	TAbi extends Abi | readonly unknown[] = Abi,
	TErrorName extends ContractErrorName<TAbi> = ContractErrorName<TAbi>
> = IsNarrowable<TAbi, Abi> extends true
	? UnionEvaluate<{
			[K in TErrorName]: {
				/** The ABI item for the error */
				abiItem: TAbi extends Abi ? Abi extends TAbi ? AbiItem : ExtractAbiError<TAbi, K> : AbiItem
				/** The decoded error arguments */
				args: ContractErrorArgs<TAbi, K>
				/** The error name */
				errorName: K
			}
		}[TErrorName]>
	: {
			/** The ABI item for the error */
			abiItem: AbiItem
			/** The decoded error arguments */
			args: readonly unknown[] | undefined
			/** The error name */
			errorName: string
		}
