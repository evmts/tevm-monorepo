import type { Events } from './event/Event.js'
import type { Read } from './read/Read.js'
import type { Write } from './write/Write.js'
import type { ParseAbi } from 'abitype'
import type { Hex } from 'viem'

export type TevmContract<
	TName extends string,
	THumanReadableAbi extends ReadonlyArray<string>,
	TBytecode extends Hex | undefined,
	TDeployedBytecode extends Hex | undefined,
> = {
	abi: ParseAbi<THumanReadableAbi>
	bytecode: TBytecode
	deployedBytecode: TDeployedBytecode
	humanReadableAbi: THumanReadableAbi
	name: TName
	events: Events<TName, THumanReadableAbi, TBytecode, TDeployedBytecode>
	read: Read<TName, THumanReadableAbi, TBytecode, TDeployedBytecode>
	write: Write<TName, THumanReadableAbi, TBytecode, TDeployedBytecode>
}
