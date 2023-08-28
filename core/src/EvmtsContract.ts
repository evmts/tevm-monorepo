import type { Events } from './event/Event'
import type { Read } from './read/Read'
import type { Write } from './write/Write'
import type { Abi, Address, FormatAbi } from 'abitype'

export type EvmtsContract<
	TName extends string,
	TAddresses extends Record<number, Address>,
	TAbi extends Abi,
	THumanReadableAbi = FormatAbi<TAbi>,
> = {
	abi: TAbi
	humanReadableAbi: THumanReadableAbi
	name: TName
	addresses: TAddresses
	events: Events<TName, TAddresses, TAbi>
	read: Read<TName, TAddresses, TAbi>
	write: Write<TName, TAddresses, TAbi>
}
