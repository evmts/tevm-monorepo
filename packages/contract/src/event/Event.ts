import type {
	Abi,
	Address,
	ExtractAbiEvent,
	ExtractAbiEventNames,
	FormatAbi,
	ParseAbi,
} from 'abitype'
import type {
	BlockNumber,
	BlockTag,
	CreateEventFilterParameters,
	GetEventArgs,
	Hex,
} from 'viem'

export type MaybeExtractEventArgsFromAbi<
	TAbi extends Abi | readonly unknown[] | undefined,
	TEventName extends string | undefined,
> = TAbi extends Abi | readonly unknown[]
	? TEventName extends string
		? GetEventArgs<TAbi, TEventName>
		: undefined
	: undefined

export type ValueOf<T> = T[keyof T]

export type Events<
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
