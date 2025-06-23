import { formatAbi } from '@tevm/utils'

/**
 * Creates read action creators from contract parameters.
 * This factory function generates a set of typed read action creators for a contract,
 * allowing for easy and type-safe creation of read actions for view and pure functions.
 *
 * @param {object} params - The parameters for creating read action creators.
 * @param {import('@tevm/utils').Abi} params.methods - The ABI of the contract methods.
 * @param {import('@tevm/utils').Abi} params.errors - The ABI of the contract errors.
 * @param {import('@tevm/utils').Hex} [params.code] - The runtime bytecode of the contract (optional).
 * @param {import('@tevm/utils').Address} [params.address] - The address of the deployed contract (optional).
 * @returns {import('./ReadActionCreator.js').ReadActionCreator<any, any, any>} An object containing read action creators for each view and pure function in the ABI.
 *
 * @example
 * ```javascript
 * import { readFactory } from './readFactory.js'
 *
 * const abi = [
 *   {
 *     type: 'function',
 *     name: 'balanceOf',
 *     inputs: [{ type: 'address', name: 'account' }],
 *     outputs: [{ type: 'uint256' }],
 *     stateMutability: 'view'
 *   }
 * ]
 *
 * const readActions = readFactory({
 *   methods: abi,
 *   address: '0x1234...',
 *   code: '0x60806040...'
 * })
 *
 * // Create a read action for the balanceOf function
 * const balanceAction = readActions.balanceOf('0x5678...')
 *
 * // Use the action with tevm
 * const balance = await tevm.contract(balanceAction)
 * console.log('Balance:', balance)
 * ```
 */
export const readFactory = ({ methods, errors, address, code }) =>
	Object.fromEntries(
		methods
			.filter(({ type }) => type === 'function')
			.filter((method) => {
				const abiFunction = /** @type {import('@tevm/utils').AbiFunction} */ (method)
				return abiFunction.stateMutability === 'view' || abiFunction.stateMutability === 'pure'
			})
			.map((method) => {
				/**
				 * Creates a read action for a specific contract method.
				 * @param {...any} args - The arguments for the contract method.
				 * @returns {object} An object representing the read action, including ABI and method information.
				 */
				const creator = (...args) => {
					// Handle case where there is an overload
					// TODO: make this more efficient
					const methodAbi = methods
						.filter(
							(m) =>
								/**@type {import('@tevm/utils').AbiFunction}*/ (m).name ===
								/**@type {import('@tevm/utils').AbiFunction}*/ (method).name,
						)
						.concat(errors)
					const maybeArgs = args.length > 0 ? { args } : {}
					return {
						abi: methodAbi,
						humanReadableAbi: formatAbi([method]),
						functionName: /**@type {import('@tevm/utils').AbiFunction}*/ (method).name,
						...(code !== undefined ? { code } : {}),
						...(address !== undefined ? { address, to: address } : {}),
						...maybeArgs,
					}
				}
				creator.abi = [method]
				creator.humanReadableAbi = formatAbi([method])
				creator.code = code
				creator.address = address
				creator.to = address
				return [/**@type {import('@tevm/utils').AbiFunction}*/ (method).name, creator]
			}),
	)
