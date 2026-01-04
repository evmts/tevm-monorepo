import { createAddress } from '@tevm/address'
import { AccountNotFoundError, InternalError } from '@tevm/errors'
import { createAccount, hexToBytes, keccak256 } from '@tevm/utils'
import { getAccountHandler } from '../GetAccount/getAccountHandler.js'
import { maybeThrowOnFail } from '../internal/maybeThrowOnFail.js'
import { validateSetAccountParams } from './validateSetAccountParams.js'

/**
 * Creates a handler for setting account state in the Ethereum Virtual Machine
 *
 * This handler allows you to completely modify an account's state, including:
 * - Setting account balance and nonce
 * - Deploying contract bytecode
 * - Modifying contract storage
 * - Setting storage roots directly
 *
 * It's particularly useful for test environments where you need to set up
 * specific contract states or account balances before running tests.
 *
 * @param {import("@tevm/node").TevmNode} client - The TEVM node instance
 * @param {object} [options] - Handler configuration options
 * @param {boolean} [options.throwOnFail] - Whether to throw errors or return them in the result object
 * @returns {import('./SetAccountHandlerType.js').SetAccountHandler} A handler function for setting account state
 * @throws {import('../SetAccount/TevmSetAccountError.js').TevmSetAccountError} When validation fails and throwOnFail is true
 * @throws {InternalError} When there's an error putting the account state and throwOnFail is true
 *
 * @example
 * ```javascript
 * import { createTevmNode } from '@tevm/node'
 * import { setAccountHandler } from '@tevm/actions'
 * import { parseEther } from '@tevm/utils'
 *
 * const node = createTevmNode()
 * const handler = setAccountHandler(node)
 *
 * // Set an account with balance and nonce
 * await handler({
 *   address: '0x1234567890123456789012345678901234567890',
 *   balance: parseEther('1000'), // 1000 ETH
 *   nonce: 5n
 * })
 *
 * // Deploy contract bytecode
 * await handler({
 *   address: '0xabcdef1234567890abcdef1234567890abcdef12',
 *   deployedBytecode: '0x608060405234801561001057600080fd5b50600436106100365760003560e01c8063...',
 *   balance: parseEther('10')
 * })
 *
 * // Set specific storage values
 * await handler({
 *   address: '0xabcdef1234567890abcdef1234567890abcdef12',
 *   state: {
 *     // storage slot => value
 *     '0x0000000000000000000000000000000000000000000000000000000000000000': '0x0000000000000000000000000000000000000000000000000000000000000001',
 *     '0x0000000000000000000000000000000000000000000000000000000000000001': '0x0000000000000000000000000000000000000000000000000000000000000002'
 *   }
 * })
 *
 * // Update individual storage slots without clearing others
 * await handler({
 *   address: '0xabcdef1234567890abcdef1234567890abcdef12',
 *   stateDiff: {
 *     '0x0000000000000000000000000000000000000000000000000000000000000000': '0x0000000000000000000000000000000000000000000000000000000000000005'
 *   }
 * })
 * ```
 */
export const setAccountHandler =
	(client, options = {}) =>
	async (params) => {
		const { throwOnFail = options.throwOnFail ?? true } = params
		/**
		 * @type {Array<import('../SetAccount/TevmSetAccountError.js').TevmSetAccountError>}
		 */
		const errors = validateSetAccountParams(params)
		if (errors.length > 0) {
			return maybeThrowOnFail(throwOnFail, { errors })
		}

		const address = createAddress(params.address)

		/**
		 * @type {Array<Promise<any>>}
		 */
		const promises = []
		try {
			const vm = await client.getVm()

			// check if account exists
			const account = await getAccountHandler(client)({ ...params, throwOnFail: false })
			if (account.errors?.length && !(account.errors[0] instanceof AccountNotFoundError)) {
				client.logger.error({ errors: account.errors }, 'there was an unexpected error getting account')
				throw account.errors.length > 1 ? new AggregateError(account.errors) : account.errors[0]
			}

			// Build account data object with proper handling of optional properties
			/** @type {Parameters<typeof createAccount>[0]} */
			const accountData = {
				nonce: params.nonce ?? account?.nonce,
				balance: params.balance ?? account?.balance,
			}

			const storageRoot =
				(params.storageRoot && hexToBytes(params.storageRoot)) ??
				(account?.storageRoot !== undefined && account?.storageRoot !== '0x'
					? hexToBytes(account.storageRoot)
					: undefined)

			const codeHash =
				(params.deployedBytecode && hexToBytes(keccak256(params.deployedBytecode))) ??
				(account?.deployedBytecode !== undefined ? hexToBytes(keccak256(account.deployedBytecode)) : undefined)

			// Only add optional properties if they are not undefined
			if (storageRoot !== undefined) {
				accountData.storageRoot = storageRoot
			}
			if (codeHash !== undefined) {
				accountData.codeHash = codeHash
			}

			// putAccount must complete before putStorage since storage requires account to exist
			await vm.stateManager.putAccount(address, createAccount(accountData))
			if (params.deployedBytecode) {
				promises.push(vm.stateManager.putCode(address, hexToBytes(params.deployedBytecode)))
			}
			// state clears state first stateDiff does not
			if (params.state) {
				await vm.stateManager.clearStorage(address)
			}
			const state = params.state ?? params.stateDiff
			if (state) {
				for (const [key, value] of Object.entries(state)) {
					promises.push(
						vm.stateManager.putStorage(
							address,
							hexToBytes(/** @type {import('@tevm/utils').Hex}*/ (key), { size: 32 }),
							hexToBytes(value),
						),
					)
				}
			}
			const results = await Promise.allSettled(promises)
			for (const result of results) {
				if (result.status === 'rejected') {
					errors.push(new InternalError('Unable to put storage', { cause: result.reason }))
				}
			}

			if (errors.length > 0) {
				return maybeThrowOnFail(throwOnFail, { errors })
			}
			await vm.stateManager.checkpoint()
			await vm.stateManager.commit(false)

			return {}
		} catch (e) {
			errors.push(new InternalError('Unexpected error setting account', { cause: e }))
			return maybeThrowOnFail(throwOnFail, { errors })
		}
	}
