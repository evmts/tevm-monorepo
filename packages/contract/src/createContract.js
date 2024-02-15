import { eventsFactory } from './event/eventFactory.js'
import { readFactory } from './read/readFactory.js'
import { writeFactory } from './write/writeFactory.js'
import { getAddress, parseAbi } from '@tevm/utils'

/**
 * Creates a tevm Contract instance from human readable abi
 * @type {import('./types.js').CreateContract}
 * @example
 * ```typescript
 * import { type Contract, createContract} from 'tevm/contract'
 *
 * const contract: Contract = createContract({
 *   name: 'MyContract',
 *  	abi: [
 *  		...
 *  	],
 * })
 * ```
 *
 * To use a json abi first pass it into `formatAbi` to turn it into human readable
 * @example
 * ```typescript
 * import { type Contract, createContract} from 'tevm/contract'
 *
 * const contract = createContract({
 *   name: 'MyContract',
 *  	abi: [
 *  		...
 *  	],
 * })
 * ```
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
		 * @param {import('@tevm/utils').Address} address
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
