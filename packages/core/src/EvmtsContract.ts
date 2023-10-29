import type { Events } from './event/Event'
import type { Read } from './read/Read'
import type { Write } from './write/Write'
import type { ParseAbi } from 'abitype'

export type EvmtsContract<
	TName extends string,
	THumanReadableAbi extends ReadonlyArray<string>,
> = {
	abi: ParseAbi<THumanReadableAbi>
	humanReadableAbi: THumanReadableAbi
	name: TName
	events: Events<TName, THumanReadableAbi>
	read: Read<TName, THumanReadableAbi>
	write: Write<TName, THumanReadableAbi>
}
