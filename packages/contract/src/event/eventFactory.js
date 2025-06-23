import { formatAbi } from '@tevm/utils'

/**
 * Creates the event action creators from the given parameters.
 * This factory function generates a set of typed event creators for a contract,
 * allowing for easy and type-safe creation of event filters.
 *
 * @param {object} params - The parameters for creating event action creators.
 * @param {import('@tevm/utils').Abi} params.events - The ABI of the contract events.
 * @param {import('@tevm/utils').Hex} [params.bytecode] - The bytecode of the contract (optional).
 * @param {import('@tevm/utils').Hex} [params.deployedBytecode] - The deployed bytecode of the contract (optional).
 * @param {import('@tevm/utils').Address} [params.address] - The address of the deployed contract (optional).
 * @returns {import('./EventActionCreator.js').EventActionCreator<any, any, any, any>} An object containing event action creators for each event in the ABI.
 *
 * @example
 * ```javascript
 * import { eventsFactory } from './eventFactory.js'
 *
 * const abi = [
 *   {
 *     type: 'event',
 *     name: 'Transfer',
 *     inputs: [
 *       { type: 'address', name: 'from', indexed: true },
 *       { type: 'address', name: 'to', indexed: true },
 *       { type: 'uint256', name: 'value', indexed: false }
 *     ]
 *   }
 * ]
 *
 * const events = eventsFactory({ abi })
 *
 * // Create a filter for the Transfer event
 * const transferFilter = events.Transfer({
 *   fromBlock: 'latest',
 *   toBlock: 'latest',
 *   args: { from: '0x1234...', to: '0x5678...' }
 * })
 *
 * // Use the filter with tevm
 * const logs = await tevm.eth.getLogs(transferFilter)
 * ```
 */
export const eventsFactory = ({ events, bytecode, deployedBytecode, address }) =>
	Object.fromEntries(
		events.map((eventAbi) => {
			/**
			 * Creates an event filter for a specific event.
			 * @param {object} params - The parameters for creating the event filter.
			 * @param {import('@tevm/utils').BlockNumber | import('@tevm/utils').BlockTag} [params.fromBlock] - The starting block for the filter.
			 * @param {import('@tevm/utils').BlockNumber | import('@tevm/utils').BlockTag} [params.toBlock] - The ending block for the filter.
			 * @param {object} [params.args] - The indexed arguments to filter by.
			 * @param {boolean} [params.strict] - Whether to use strict matching for arguments.
			 * @returns {object} An object representing the event filter, including ABI and bytecode information.
			 */
			const creator = (params) => {
				return {
					eventName: /**@type any*/ (eventAbi).name,
					abi: [eventAbi],
					humanReadableAbi: formatAbi([eventAbi]),
					bytecode,
					deployedBytecode,
					address,
					...params,
				}
			}
			creator.abi = [eventAbi]
			creator.eventName = /**@type any*/ (eventAbi).name
			creator.humanReadableAbi = formatAbi([eventAbi])
			creator.bytecode = bytecode
			creator.deployedBytecode = deployedBytecode
			creator.address = address
			return [/**@type any*/ (eventAbi).name, creator]
		}),
	)
