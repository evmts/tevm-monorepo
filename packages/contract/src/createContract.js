import { eventsFactory } from './event/eventFactory.js'
import { readFactory } from './read/readFactory.js'
import { writeFactory } from './write/writeFactory.js'
import { parseAbi } from 'abitype'
import { getAddress } from 'viem'

/**
 * Creates a tevm Contract instance from human readable abi
 * To use a json abi first pass it into `formatAbi` to turn it into human readable
 * @type {import('./types.js').CreateContract}
 */
export const createContract = ({ name, humanReadableAbi }) => {
	const abi = parseAbi(/**@type any*/ (humanReadableAbi))
	const methods = abi.filter((field) => {
		return field.type === 'function'
	})
	const baseContract = {
		name,
		abi: abi,
		humanReadableAbi,
		// TODO make this more internally typesafe
		events: eventsFactory({ abi }),
		// TODO make this more internally typesafe
		write: writeFactory({ methods }),
		// TODO make this more internally typesafe
		read: readFactory({ methods }),
	}
	return /**@type any*/ ({
		...baseContract,
		/**
		 * @param {import('abitype').Address} address
		 */
		withAddress: (address) => {
			const formattedAddress = getAddress(address)
			return {
				...baseContract,
				address: formattedAddress,
				// TODO make this more internally typesafe
				events: eventsFactory({ abi, address: formattedAddress }),
				// TODO make this more internally typesafe
				write: writeFactory({ methods, address: formattedAddress }),
				// TODO make this more internally typesafe
				read: readFactory({ methods, address: formattedAddress }),
			}
		},
	})
}
