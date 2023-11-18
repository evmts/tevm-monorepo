import type { Events } from './event/Event'
import type { Read } from './read/Read'
import type { Write } from './write/Write'
import type { ParseAbi } from 'abitype'
import type { Hex } from 'viem'

export type EvmtsContract<
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
