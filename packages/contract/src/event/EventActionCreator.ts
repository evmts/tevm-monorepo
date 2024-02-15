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
 * Adapted from viem. This is a helper type to extract the event args from an abi
 */
export type MaybeExtractEventArgsFromAbi<
	TAbi extends Abi | readonly unknown[] | undefined,
	TEventName extends string | undefined,
> = TAbi extends Abi | readonly unknown[]
	? TEventName extends string
		? GetEventArgs<TAbi, TEventName>
		: undefined
	: undefined

export type ValueOf<T> = T[keyof T]

/**
 * A mapping of event names to action creators for events. Can be used to create event filters in a typesafe way
 * @example
 * ```typescript
 * tevm.eth.getLog(
 *   MyScript.withAddress('0x420...').events.Transfer({ from: '0x1234...' }),
 * )
 * ===
 */
export type EventActionCreator<
	THumanReadableAbi extends readonly string[],
	TBytecode extends Hex | undefined,
	TDeployedBytecode extends Hex | undefined,
	TAddress extends Address | undefined,
	TAddressArgs = TAddress extends undefined ? {} : { address: TAddress },
> = {
	// for every event in the abi, create an action creator
	[TEventName in ExtractAbiEventNames<ParseAbi<THumanReadableAbi>>]: (<
		TStrict extends boolean = false,
		TFromBlock extends BlockNumber | BlockTag | undefined = undefined,
		TToBlock extends BlockNumber | BlockTag | undefined = undefined,
	>(
		// take take these actions. These match the shape of viem actions
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
		humanReadableAbi: FormatAbi<
			[ExtractAbiEvent<ParseAbi<THumanReadableAbi>, TEventName>]
		>
		abi: [ExtractAbiEvent<ParseAbi<THumanReadableAbi>, TEventName>]
		bytecode: TBytecode
		deployedBytecode: TDeployedBytecode
	} & TAddressArgs
}
