import { encodeDeployData, getAddress, parseAbi } from '@tevm/utils'
import { eventsFactory } from './event/eventFactory.js'
import { readFactory } from './read/readFactory.js'
import { writeFactory } from './write/writeFactory.js'

/**
 * Creates a tevm Contract instance from human readable abi
 * @type {import('./CreateContractFn.js').CreateContractFn}
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
export const createContract = ({ name, humanReadableAbi, address, deployedBytecode, code, bytecode }) => {
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
		...(address !== undefined ? { address: getAddress(address) } : {}),
		...(code !== undefined ? { code } : {}),
		...(bytecode !== undefined ? { bytecode } : {}),
		...(deployedBytecode !== undefined ? { deployedBytecode } : {}),
	}
	/**
	 * @param {import('@tevm/utils').Address} address
	 */
	const withAddress = (address) => {
		const formattedAddress = getAddress(address)
		return createContract(
			/** @type {any}*/ ({
				...baseContract,
				address: formattedAddress,
			}),
		)
	}
	/**
	 * @type {import('./CreateScript.js').CreateScript<any, any, any, any, any, any>}
	 */
	const script = (...args) => {
		const params = args[0]
		const _bytecode = (() => {
			if (params && 'bytecode' in params && params.bytecode) {
				return params.bytecode
			}
			if (bytecode) {
				return bytecode
			}
			if (deployedBytecode) {
				return deployedBytecode
			}
			throw new Error('Unknown bytecode error')
		})()
		const constructorAbi = abi.find((item) => item.type === 'constructor')
		const code = (() => {
			if (!constructorAbi) {
				return _bytecode
			}
			if (!args) {
				return _bytecode
			}
			return encodeDeployData({
				abi,
				bytecode: _bytecode,
				args,
			})
		})()
		return createContract(
			/** @type {any}*/ ({
				...baseContract,
				bytecode: _bytecode,
				code,
			}),
		)
	}
	return /**@type any*/ ({
		...baseContract,
		withAddress,
		script,
	})
}
