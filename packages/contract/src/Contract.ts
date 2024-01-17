import type { Events } from './event/Event.js'
import type { Read } from './read/Read.js'
import type { Write } from './write/Write.js'
import type { Address, ParseAbi } from 'abitype'

export type Contract<
	TName extends string,
	THumanReadableAbi extends ReadonlyArray<string>,
> = {
	abi: ParseAbi<THumanReadableAbi>
	bytecode?: undefined
	deployedBytecode?: undefined
	humanReadableAbi: THumanReadableAbi
	name: TName
	events: Events<THumanReadableAbi, undefined, undefined, undefined>
	read: Read<THumanReadableAbi, undefined, undefined, undefined>
	write: Write<THumanReadableAbi, undefined, undefined, undefined>
	withAddress: <TAddress extends Address>(address: TAddress) => Omit<
		Contract<TName, THumanReadableAbi>,
		'read' | 'write' | 'events'
	> & {
		address: TAddress
		events: Events<THumanReadableAbi, undefined, undefined, TAddress>
		read: Read<THumanReadableAbi, undefined, undefined, TAddress>
		write: Write<THumanReadableAbi, undefined, undefined, TAddress>
	}
}
