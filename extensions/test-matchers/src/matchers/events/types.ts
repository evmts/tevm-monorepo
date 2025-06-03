import type { ExtractAbiEvent } from 'abitype'
import type { ContractEventName, Log } from 'viem'
import type { Abi } from 'viem'

// Contract-like object with ABI
export interface ContractLike<TAbi extends Abi = Abi> {
	abi: TAbi
	address?: `0x${string}`
}

// Transaction-like object that has logs
export interface TransactionLike {
	logs: Log[]
}

// State for toEmit matcher to pass to chained matchers
export type ToEmitState<
	TAbi extends Abi | undefined = Abi | undefined,
	TEventName extends TAbi extends Abi ? ContractEventName<TAbi> : never = TAbi extends Abi
		? ContractEventName<TAbi>
		: never,
> = TAbi extends Abi
	? {
			matchedLogs: Log[]
			contract: ContractLike<TAbi>
			eventName: TEventName
			eventAbi: ExtractAbiEvent<TAbi, TEventName>
		}
	: {
			matchedLogs: Log[]
			eventIdentifier: string
		}
