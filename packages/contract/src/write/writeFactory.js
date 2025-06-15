import { formatAbi } from '@tevm/utils'

/**
 * Creates write action creators from contract parameters.
 * This factory function generates a set of typed write action creators for a contract,
 * allowing for easy and type-safe creation of write actions for payable and nonpayable functions.
 *
 * @param {object} params - The parameters for creating write action creators.
 * @param {import('@tevm/utils').Abi} params.methods - The ABI of the contract methods.
 * @param {import('@tevm/utils').Abi} params.errors - The ABI of the contract errors.
 * @param {import('@tevm/utils').Hex} [params.code] - The runtime bytecode of the contract (optional).
 * @param {import('@tevm/utils').Address} [params.address] - The address of the deployed contract (optional).
 * @returns {import('./WriteActionCreator.js').WriteActionCreator<any, any, any>} An object containing write action creators for each payable and nonpayable function in the ABI.
 *
 * @example
 * ```javascript
 * import { writeFactory } from './writeFactory.js'
 *
 * const abi = [
 *   {
 *     type: 'function',
 *     name: 'transfer',
 *     inputs: [
 *       { type: 'address', name: 'to' },
 *       { type: 'uint256', name: 'amount' }
 *     ],
 *     outputs: [{ type: 'bool' }],
 *     stateMutability: 'nonpayable'
 *   }
 * ]
 *
 * const writeActions = writeFactory({
 *   methods: abi,
 *   address: '0x1234...',
 *   code: '0x60806040...'
 * })
 *
 * // Create a write action for the transfer function
 * const transferAction = writeActions.transfer('0x5678...', 1000n)
 *
 * // Use the action with tevm
 * const result = await tevm.contract(transferAction)
 * console.log('Transaction hash:', result.transactionHash)
 * ```
 */
export const writeFactory = ({ methods, errors, address, code }) =>
	Object.fromEntries(
		methods
			.filter(({ type }) => type === 'function')
			.filter((method) => {
				const abiFunction = /** @type {import('@tevm/utils').AbiFunction} */ (method)
				return abiFunction.stateMutability === 'payable' || abiFunction.stateMutability === 'nonpayable'
			})
			.map((method) => {
				/**
				 * Creates a write action for a specific contract method.
				 * @param {...any} args - The arguments for the contract method.
				 * @returns {object} An object representing the write action, including ABI and method information.
				 */
				const creator = (...args) => {
					// Handle case where there is an overload
					// TODO: make this more efficient
					const methodAbi = methods
						.filter(
							(m) =>
								/**@type {import('@tevm/utils').AbiFunction}*/ (m).name ===
								/**@type {import('@tevm/utils').AbiFunction}*/ (method)?.name,
						)
						.concat(errors)
					// viem and wagmi barf if we pass in undefined or [] for args so do this to accommodate viem and wagmi
					const maybeArgs = args.length > 0 ? { args } : {}
					return {
						abi: methodAbi,
						humanReadableAbi: formatAbi([method]),
						functionName: /**@type {import('@tevm/utils').AbiFunction}*/ (method).name,
						...(address !== undefined ? { address, to: address } : {}),
						...(code !== undefined ? { code } : {}),
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
