import { InvalidParamsError } from '@tevm/errors'
import { formatAbi, getAddress, parseAbi } from '@tevm/utils'
import { eventsFactory } from './event/eventFactory.js'
import { readFactory } from './read/readFactory.js'
import { writeFactory } from './write/writeFactory.js'

/**
 * Creates a Tevm Contract instance from a human-readable ABI or JSON ABI.
 * This function is the core of Tevm's contract interaction capabilities,
 * allowing for type-safe and easy-to-use contract interfaces.
 *
 * @type {import('./CreateContractFn.js').CreateContractFn}
 * @throws {InvalidParamsError} If neither humanReadableAbi nor abi is provided.
 *
 * @example
 * Using a human-readable ABI:
 * ```typescript
 * import { createContract } from 'tevm/contract'
 *
 * const contract = createContract({
 *   name: 'ERC20',
 *   humanReadableAbi: [
 *     'function balanceOf(address account) view returns (uint256)',
 *     'function transfer(address to, uint256 amount) returns (bool)',
 *     'event Transfer(address indexed from, address indexed to, uint256 value)'
 *   ],
 *   address: '0x6B175474E89094C44Da98b954EedeAC495271d0F' // DAI token address
 * })
 *
 * // Read contract state
 * const balanceAction = contract.read.balanceOf('0x1234...')
 * const balance = await tevm.contract(balanceAction)
 *
 * // Write to contract
 * const transferAction = contract.write.transfer('0x5678...', 1000n)
 * const result = await tevm.contract(transferAction)
 *
 * // Create event filter
 * const transferFilter = contract.events.Transfer({ fromBlock: 'latest' })
 * const logs = await tevm.eth.getLogs(transferFilter)
 * ```
 *
 * @example
 * Using a JSON ABI:
 * ```typescript
 * import { createContract } from 'tevm/contract'
 *
 * const contract = createContract({
 *   name: 'ERC20',
 *   abi: [
 *     {
 *       "inputs": [{"name": "account", "type": "address"}],
 *       "name": "balanceOf",
 *       "outputs": [{"type": "uint256"}],
 *       "stateMutability": "view",
 *       "type": "function"
 *     },
 *     // ... other ABI entries
 *   ],
 *   address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
 *   bytecode: '0x60806040...', // Optional: Creation bytecode
 *   deployedBytecode: '0x608060405...', // Optional: Deployed bytecode
 *   code: '0x608060405...' // Optional: Runtime bytecode
 * })
 *
 * // Use the contract as in the previous example
 * ```
 *
 * @see {@link Contract} for the full API of the returned Contract instance.
 * @see {@link https://tevm.sh/learn/contracts/} for more information on working with contracts in Tevm.
 * @see {@link https://tevm.sh/reference/tevm/contract/types/Contract/} for detailed Contract type documentation.
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
			docsPath: '/learn/contracts/',
		})
	})()

	const methods = abi.filter((field) => {
		return field.type === 'function'
	})
	const events = abi.filter((field) => {
		return field.type === 'event'
	})
	const errors = abi.filter((field) => {
		return field.type === 'error'
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
		events: eventsFactory({ events, ...optionalArgs }),
		// TODO make this more internally typesafe
		write: writeFactory({ methods, errors, ...optionalArgs }),
		// TODO make this more internally typesafe
		read: readFactory({ methods, errors, address, ...optionalArgs }),
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
	 * @param {import('@tevm/utils').Hex} encodedBytecode
	 */
	const withCode = (encodedBytecode) => {
		return createContract(
			/** @type {any} */ ({
				...baseContract,
				code: encodedBytecode,
			}),
		)
	}

	return /**@type any*/ ({
		...baseContract,
		withCode,
		withAddress,
		/**
		 * @param {Array<any>} args
		 */
		deploy: (...args) => {
			const maybeArgs = args.length > 0 ? { args } : {}
			if (!baseContract.bytecode) {
				throw new Error('Bytecode is required to generate deploy data')
			}
			return {
				...maybeArgs,
				bytecode: baseContract.bytecode,
				abi,
			}
		},
	})
}
