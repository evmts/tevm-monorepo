import type {
	GetEventArgsFromTopics,
	InferEventName,
} from '../../types/contract.js'
import type { Hex } from '../../types/misc.js'
import type { Prettify } from '../../types/utils.js'
import type { Abi, ExtractAbiEventNames } from 'abitype'
export type DecodeEventLogParameters<
	TAbi extends Abi | readonly unknown[] = Abi,
	TEventName extends string | undefined = string,
	TTopics extends Hex[] = Hex[],
	TData extends Hex | undefined = undefined,
	TStrict extends boolean = true,
> = {
	abi: TAbi
	data?: TData
	eventName?: InferEventName<TAbi, TEventName>
	strict?: TStrict
	topics: [signature: Hex, ...args: TTopics] | []
}
export type DecodeEventLogReturnType<
	TAbi extends Abi | readonly unknown[] = Abi,
	TEventName extends string | undefined = string,
	TTopics extends Hex[] = Hex[],
	TData extends Hex | undefined = undefined,
	TStrict extends boolean = true,
	_EventNames extends string = TAbi extends Abi
		? Abi extends TAbi
			? string
			: ExtractAbiEventNames<TAbi>
		: string,
> = TEventName extends _EventNames[number]
	? Prettify<
			{
				eventName: TEventName
			} & GetEventArgsFromTopics<TAbi, TEventName, TTopics, TData, TStrict>
	  >
	: {
			[TName in _EventNames]: Prettify<
				{
					eventName: TName
				} & GetEventArgsFromTopics<TAbi, TName, TTopics, TData, TStrict>
			>
	  }[_EventNames]
export declare function decodeEventLog<
	const TAbi extends Abi | readonly unknown[],
	TEventName extends string | undefined = undefined,
	TTopics extends Hex[] = Hex[],
	TData extends Hex | undefined = undefined,
	TStrict extends boolean = true,
>({
	abi,
	data,
	strict: strict_,
	topics,
}: DecodeEventLogParameters<
	TAbi,
	TEventName,
	TTopics,
	TData,
	TStrict
>): DecodeEventLogReturnType<TAbi, TEventName, TTopics, TData, TStrict>
//# sourceMappingURL=decodeEventLog.d.ts.map
