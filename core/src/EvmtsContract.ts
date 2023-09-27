import type { Events } from './event/Event'
import type { Read } from './read/Read'
import type { Write } from './write/Write'
import type { Abi, FormatAbi } from 'abitype'

export type EvmtsContract<
	TName extends string,
	TAbi extends Abi,
	THumanReadableAbi = FormatAbi<TAbi>,
> = {
	abi: TAbi
	humanReadableAbi: THumanReadableAbi
	name: TName
	events: Events<TName, TAbi>
	read: Read<TName, TAbi>
	write: Write<TName, TAbi>
}
