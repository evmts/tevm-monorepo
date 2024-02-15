import { eventsFactory } from './event/eventFactory.js'
import { readFactory } from './read/readFactory.js'
import { writeFactory } from './write/writeFactory.js'
import { getAddress, parseAbi } from '@tevm/utils'

/**
 * Creates a Tevm `Script` instance from humanReadableAbi and bytecode
 * @type {import('./types.js').CreateScript}
 * @example
 * ```typescript
 * import { type Script, createScript} from 'tevm/contract'
 *
 * const script: Script = createScript({
 *   name: 'MyScript',
 *   humanReadableAbi: ['function exampleRead(): uint256', ...],
 *   bytecode: '0x123...',
 *   deployedBytecode: '0x123...',
 * })
 * ```
 *
 * To use a json abi first pass it into `formatAbi` to turn it into human readable
 * @example
 * ```typescript
 * import { type Script, createScript, formatAbi} from 'tevm/contract'
 * import { formatAbi } from 'tevm/utils'
 *
 * const script = createScript({
 *  name: 'MyScript',
 *  bytecode: '0x123...',
 *  deployedBytecode: '0x123...',
 *  humanReadableAbi: formatAbi([
 *   {
 *     name: 'balanceOf',
 *     inputs: [
 *     {
 *     name: 'owner',
 *     type: 'address',
 *     },
 *     ],
 *     outputs: [
 *     {
 *     name: 'balance',
 *     type: 'uint256',
 *     },
 *   }
 *   ]),
 *  })
 *  ```
 */
export const createScript = ({
	name,
	humanReadableAbi,
	bytecode,
	deployedBytecode,
}) => {
	const abi = parseAbi(/**@type any*/ (humanReadableAbi))
	const methods = abi.filter((field) => {
		return field.type === 'function'
	})
	const baseScript = {
		name,
		abi: abi,
		humanReadableAbi,
		bytecode,
		deployedBytecode,
		// TODO make this more internally typesafe
		events: eventsFactory({ abi, bytecode, deployedBytecode }),
		// TODO make this more internally typesafe
		write: writeFactory({ methods, bytecode, deployedBytecode }),
		// TODO make this more internally typesafe
		read: readFactory({ methods, bytecode, deployedBytecode }),
	}
	return /**@type any*/ ({
		...baseScript,
		/**
		 * @param {import('@tevm/utils').Address} address
		 */
		withAddress: (address) => {
			const formattedAddress = getAddress(address)
			return {
				...baseScript,
				address: formattedAddress,
				// TODO make this more internally typesafe
				events: eventsFactory({
					abi,
					bytecode,
					deployedBytecode,
					address: formattedAddress,
				}),
				// TODO make this more internally typesafe
				write: writeFactory({
					methods,
					bytecode,
					deployedBytecode,
					address: formattedAddress,
				}),
				// TODO make this more internally typesafe
				read: readFactory({
					methods,
					bytecode,
					deployedBytecode,
					address: formattedAddress,
				}),
			}
		},
	})
}
