import type { Events } from './event/Event.js'
import type { Read } from './read/Read.js'
import type { Write } from './write/Write.js'
import type { Address, ParseAbi } from 'abitype'
import type { Hex } from 'viem'

export type Script<
	TName extends string,
	THumanReadableAbi extends ReadonlyArray<string>,
> = {
	abi: ParseAbi<THumanReadableAbi>
	bytecode: Hex
	deployedBytecode: Hex
	humanReadableAbi: THumanReadableAbi
	name: TName
	events: Events<THumanReadableAbi, Hex, Hex, undefined>
	read: Read<THumanReadableAbi, Hex, Hex, undefined>
	write: Write<THumanReadableAbi, Hex, Hex, undefined>
	withAddress: <TAddress extends Address>(address: TAddress) => Script<
		TName,
		THumanReadableAbi
	> & {
		address: TAddress
		events: Events<THumanReadableAbi, Hex, Hex, TAddress>
		read: Read<THumanReadableAbi, Hex, Hex, TAddress>
		write: Write<THumanReadableAbi, Hex, Hex, TAddress>
	}
}
