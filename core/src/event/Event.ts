import type {
	Abi,
	ExtractAbiEvent,
	ExtractAbiEventNames,
	FormatAbi,
} from 'abitype'
import type { BlockNumber, BlockTag, CreateEventFilterParameters } from 'viem'
import type { MaybeExtractEventArgsFromAbi } from 'viem/dist/types/types/contract'

export type ValueOf<T> = T[keyof T]

export type Events<TName extends string, TAbi extends Abi> = {
	[TEventName in ExtractAbiEventNames<TAbi>]: (<
		TStrict extends boolean = false,
		TFromBlock extends BlockNumber | BlockTag | undefined = undefined,
		TToBlock extends BlockNumber | BlockTag | undefined = undefined,
	>(
		params: Pick<
			CreateEventFilterParameters<
				ExtractAbiEvent<TAbi, TEventName>,
				TAbi,
				TStrict,
				TFromBlock,
				TToBlock,
				TEventName,
				MaybeExtractEventArgsFromAbi<TAbi, TEventName>
			>,
			'fromBlock' | 'toBlock' | 'args' | 'strict'
		>,
	) => CreateEventFilterParameters<
		ExtractAbiEvent<TAbi, TEventName>,
		TAbi,
		TStrict,
		TFromBlock,
		TToBlock,
		TEventName,
		MaybeExtractEventArgsFromAbi<TAbi, TEventName>
	> & {
		evmtsContractName: TName
		eventName: TEventName
		abi: [ExtractAbiEvent<TAbi, TEventName>]
	}) & {
		eventName: TEventName
		abi: [ExtractAbiEvent<TAbi, TEventName>]
		humanReadableAbi: FormatAbi<[ExtractAbiEvent<TAbi, TEventName>]>
	}
}
