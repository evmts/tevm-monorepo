import type {
	Abi,
	Address,
	BlockNumber,
	BlockTag,
	CreateEventFilterParameters,
	ExtractAbiEvent,
	ExtractAbiEventNames,
	FormatAbi,
	GetEventArgs,
	Hex,
	ParseAbi,
} from '@tevm/utils'

/**
 * Extracts event arguments from an ABI.
 * @template TAbi - The ABI type, can be an Abi, readonly unknown[], or undefined.
 * @template TEventName - The name of the event, can be a string or undefined.
 */
export type MaybeExtractEventArgsFromAbi<
	TAbi extends Abi | readonly unknown[] | undefined,
	TEventName extends string | undefined,
> = Exclude<
	TAbi extends Abi | readonly unknown[]
		? TEventName extends string
			? GetEventArgs<TAbi, TEventName>
			: undefined
		: undefined,
	readonly unknown[] | Record<string, unknown>
>

/**
 * Utility type to get the value type of an object.
 * @template T - The object type.
 */
export type ValueOf<T> = T[keyof T]

/**
 * A mapping of event names to action creators for events. Can be used to create event filters in a typesafe way.
 * @template THumanReadableAbi - The human-readable ABI of the contract.
 * @template TBytecode - The bytecode of the contract.
 * @template TDeployedBytecode - The deployed bytecode of the contract.
 * @template TAddress - The address of the contract.
 * @template TAddressArgs - Additional arguments for the address.
 *
 * @example
 * ```typescript
 * // Creating an event filter for a Transfer event
 * const filter = MyContract.events.Transfer({
 *   fromBlock: 'latest',
 *   toBlock: 'latest',
 *   args: { from: '0x1234...', to: '0x5678...' }
 * })
 *
 * // Using the filter with tevm
 * const logs = await tevm.eth.getLogs(filter)
 * ```
 */
export type EventActionCreator<
	THumanReadableAbi extends readonly string[],
	TBytecode extends Hex | undefined,
	TDeployedBytecode extends Hex | undefined,
	TAddress extends Address | undefined,
	TAddressArgs = TAddress extends undefined ? {} : { address: TAddress },
> = {
	[TEventName in ExtractAbiEventNames<ParseAbi<THumanReadableAbi>>]: (<
		TStrict extends boolean = false,
		TFromBlock extends BlockNumber | BlockTag | undefined = undefined,
		TToBlock extends BlockNumber | BlockTag | undefined = undefined,
	>(
		params: Pick<
			// CreateEventFilterParameters create viem like parameters
			// we are taking the subset that aren't implied already from Contract.event.eventName specification
			// such as abi, eventName etc.
			CreateEventFilterParameters<
				ExtractAbiEvent<ParseAbi<THumanReadableAbi>, TEventName>,
				ParseAbi<THumanReadableAbi>,
				TStrict,
				TFromBlock,
				TToBlock,
				TEventName,
				MaybeExtractEventArgsFromAbi<ParseAbi<THumanReadableAbi>, TEventName>
			>,
			'fromBlock' | 'toBlock' | 'args' | 'strict'
		>,
		// Return the following parameters. It merges the supplied parameters with the event name and abi etc.
	) => CreateEventFilterParameters<
		ExtractAbiEvent<ParseAbi<THumanReadableAbi>, TEventName>,
		ParseAbi<THumanReadableAbi>,
		TStrict,
		TFromBlock,
		TToBlock,
		TEventName,
		MaybeExtractEventArgsFromAbi<ParseAbi<THumanReadableAbi>, TEventName>
	> & {
		eventName: TEventName
		abi: [ExtractAbiEvent<ParseAbi<THumanReadableAbi>, TEventName>]
		bytecode: TBytecode
		deployedBytecode: TDeployedBytecode
		// if you use the action creator without supplying arguments it's the same shape but missing args
		// can be useful for lazily evaluating
	}) & {
		eventName: TEventName
		humanReadableAbi: FormatAbi<[ExtractAbiEvent<ParseAbi<THumanReadableAbi>, TEventName>]>
		abi: [ExtractAbiEvent<ParseAbi<THumanReadableAbi>, TEventName>]
		bytecode: TBytecode
		deployedBytecode: TDeployedBytecode
	} & TAddressArgs
}
