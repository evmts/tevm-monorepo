import type { ExtractAbiEvent } from 'abitype'
import type { ContractEventName, Log } from 'viem'
import type { Abi } from 'viem'
import type { ContainsContractAbi } from '../../common/types.js'

// State for toEmit matcher to pass to chained matchers
export type ToEmitState<
	TAbi extends Abi | undefined = Abi | undefined,
	TEventName extends TAbi extends Abi ? ContractEventName<TAbi> : never = TAbi extends Abi
		? ContractEventName<TAbi>
		: never,
> = TAbi extends Abi
	? {
			matchedLogs: Log[]
			contract: ContainsContractAbi<TAbi>
			eventName: TEventName
			eventAbi: ExtractAbiEvent<TAbi, TEventName>
		}
	: {
			matchedLogs: Log[]
			eventIdentifier: string
		}
