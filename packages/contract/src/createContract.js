import { encodeDeployData, formatAbi, getAddress, parseAbi } from '@tevm/utils'
import { eventsFactory } from './event/eventFactory.js'
import { readFactory } from './read/readFactory.js'
import { writeFactory } from './write/writeFactory.js'
import { InvalidParamsError } from '@tevm/errors'

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
export const createContract = ({
	name,
	humanReadableAbi: _humanReadableAbi,
	abi: _abi,
	address,
	deployedBytecode,
	code,
	bytecode,
}) => {
	const { abi, humanReadableAbi } = (() => {
		if (_abi) {
			return { abi: _abi, humanReadableAbi: formatAbi(_abi) }
		}
		if (_humanReadableAbi) {
			return { abi: parseAbi(_humanReadableAbi), humanReadableAbi: _humanReadableAbi }
		}
		throw new InvalidParamsError('Must provide either humanReadableAbi or abi', {
			docsPath: 'https://tevm.sh/learn/contracts/',
		})
	})()

	const methods = abi.filter((field) => {
		return field.type === 'function'
	})
	const optionalArgs = {
		...(address !== undefined ? { address: getAddress(address) } : {}),
		...(code !== undefined ? { code } : {}),
		...(bytecode !== undefined ? { bytecode } : {}),
		...(deployedBytecode !== undefined ? { deployedBytecode } : {}),
	}
	const baseContract = {
		...optionalArgs,
		name,
		abi: abi,
		humanReadableAbi,
		// TODO make this more internally typesafe
		events: eventsFactory({ abi, ...optionalArgs }),
		// TODO make this more internally typesafe
		write: writeFactory({ methods, ...optionalArgs }),
		// TODO make this more internally typesafe
		read: readFactory({ methods, address, ...optionalArgs }),
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
	 * @type {import('./CreateScript.js').CreateScript<any, any, any, any>}
	 */
	const script = (params) => {
		const _bytecode = (() => {
			// this case needs test coverage
			if (params && 'bytecode' in params && params.bytecode) {
				return params.bytecode
			}
			// this case needs test coverage
			if (bytecode) {
				return bytecode
			}
			// this case needs test coverage
			if (deployedBytecode) {
				return deployedBytecode
			}
			// this case needs test coverage
			throw new Error('Unknown bytecode error')
		})()
		const constructorAbi = abi.find((item) => item.type === 'constructor')
		const code = (() => {
			if (!constructorAbi) {
				return _bytecode
			}
			// this case needs test coverage
			if (!('constructorArgs' in params) || /** @type {Array<any>}*/ (params.constructorArgs)?.length < 1) {
				return _bytecode
			}
			// this case needs test coverage
			return encodeDeployData({
				abi: /** @type {any}*/ (abi),
				bytecode: _bytecode,
				args: /** @type {any}*/ (params.constructorArgs),
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
		/**
		 * @param {Array<any>} args
		 */
		deploy: (...args) => {
			const maybeArgs = args.length > 0 ? { args } : {}
			return {
				...maybeArgs,
				bytecode: baseContract.bytecode,
				abi,
			}
		},
	})
}
