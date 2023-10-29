import type { GetEventArgs, InferEventName } from '../../types/contract.js'
import type { Abi } from 'abitype'
export type EncodeEventTopicsParameters<
	TAbi extends Abi | readonly unknown[] = Abi,
	TEventName extends string | undefined = string,
	_EventName = InferEventName<TAbi, TEventName>,
> = {
	eventName?: _EventName
} & (TEventName extends string
	? {
			abi: TAbi
			args?: GetEventArgs<TAbi, TEventName>
	  }
	: _EventName extends string
	? {
			abi: [TAbi[number]]
			args?: GetEventArgs<TAbi, _EventName>
	  }
	: never)
export declare function encodeEventTopics<
	const TAbi extends Abi | readonly unknown[],
	TEventName extends string | undefined = undefined,
>({
	abi,
	eventName,
	args,
}: EncodeEventTopicsParameters<TAbi, TEventName>): `0x${string}`[]
//# sourceMappingURL=encodeEventTopics.d.ts.map
