import { Events } from './event/Event'
import { Read } from './read/Read'
import { Write } from './write/Write'
import type { Abi, Address, FormatAbi } from 'abitype'

export type EvmtsContract<
	TName extends string,
	TAddresses extends Record<number, Address>,
	TAbi extends Abi,
	THumanReadableAbi = FormatAbi<TAbi>,
> = {
	abi: TAbi
	humanReadableAbi: THumanReadableAbi
	bytecode: `0x${string}`
	name: TName
	addresses: TAddresses
	events: Events<TName, TAddresses, TAbi>
	read: Read<TName, TAddresses, TAbi>
	write: Write<TName, TAddresses, TAbi>
}
