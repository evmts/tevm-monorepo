import type { EvmtsContract } from './EvmtsContract'
import { eventsFactory } from './event/eventFactory'
import { readFactory } from './read/readFactory'
import { writeFactory } from './write/writeFactory'
import type { Abi, Address } from 'abitype'
import { formatAbi } from 'abitype'

export const evmtsContractFactory = <
	TName extends string,
	TAddresses extends Record<number, Address>,
	TAbi extends Abi,
>({
	abi,
	name,
	addresses,
	bytecode,
}: Pick<
	EvmtsContract<TName, TAddresses, TAbi>,
	'name' | 'abi' | 'addresses' | 'bytecode'
>): EvmtsContract<TName, TAddresses, TAbi> => {
	const methods = abi.filter((field) => {
		return field.type === 'function'
	})
	return {
		name,
		abi,
		humanReadableAbi: formatAbi(abi),
		addresses,
		bytecode,
		// TODO make this more internally typesafe
		events: eventsFactory({ abi, addresses }) as any,
		// TODO make this more internally typesafe
		write: writeFactory({ addresses, methods }) as any,
		// TODO make this more internally typesafe
		read: readFactory({ addresses, methods }) as any,
	}
}
