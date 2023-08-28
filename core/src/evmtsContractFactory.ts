import type { EvmtsContract } from './EvmtsContract'
import { eventsFactory } from './event/eventFactory'
import { readFactory } from './read/readFactory'
import { writeFactory } from './write/writeFactory'
import type { Abi, Address } from 'abitype'
import { formatAbi } from 'abitype'
import { isAddress } from 'viem'

export const evmtsContractFactory = <
	TName extends string,
	TAddresses extends Record<number, Address>,
	TAbi extends Abi,
>({
	abi,
	name,
	addresses,
}: Pick<
	EvmtsContract<TName, TAddresses, TAbi>,
	'name' | 'abi' | 'addresses'
>): EvmtsContract<TName, TAddresses, TAbi> => {
	Object.values(addresses).forEach((address) => {
		if (!isAddress(address)) {
			throw new Error(`"${address} is not a valid ethereum address`)
		}
	})
	const methods = abi.filter((field) => {
		return field.type === 'function'
	})
	return {
		name,
		abi,
		humanReadableAbi: formatAbi(abi),
		addresses,
		// TODO make this more internally typesafe
		events: eventsFactory({ abi, addresses }) as any,
		// TODO make this more internally typesafe
		write: writeFactory({ addresses, methods }) as any,
		// TODO make this more internally typesafe
		read: readFactory({ addresses, methods }) as any,
	}
}
