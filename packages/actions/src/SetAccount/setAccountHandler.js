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
 * Use `state` to overwrite the account's storage (clears existing slots first) or
 * `stateDiff` to patch individual slots without clearing.
 *
 * @param {import("@tevm/node").TevmNode} client
 * @param {object} [options]
 * @param {boolean} [options.throwOnFail]
 * @returns {import('./SetAccountHandlerType.js').SetAccountHandler}
 * @throws {import('../SetAccount/TevmSetAccountError.js').TevmSetAccountError} When validation fails and throwOnFail is true.
 * @throws {InternalError} When putting account state fails and throwOnFail is true.
 *
 * @example
 * ```javascript
 * import { createTevmNode } from '@tevm/node'
 * import { setAccountHandler } from '@tevm/actions'
 * import { parseEther } from 'viem'
 *
 * const handler = setAccountHandler(createTevmNode())
 * await handler({
 *   address: '0x1234567890123456789012345678901234567890',
 *   balance: parseEther('1000'),
 *   nonce: 5n,
 *   deployedBytecode: '0x6080...',
 *   stateDiff: { '0x00...00': '0x00...05' },
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

		let checkpointed = false
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

			await vm.stateManager.checkpoint()
			checkpointed = true
			await vm.stateManager.putAccount(address, createAccount(accountData))
			if (params.deployedBytecode) {
				await vm.stateManager.putCode(address, hexToBytes(params.deployedBytecode))
			}
			// state clears state first stateDiff does not
			if (params.state) {
				await vm.stateManager.clearStorage(address)
			}
			const state = params.state ?? params.stateDiff
			if (state) {
				for (const [key, value] of Object.entries(state)) {
					await vm.stateManager.putStorage(
						address,
						hexToBytes(/** @type {import('@tevm/utils').Hex}*/ (key), { size: 32 }),
						hexToBytes(value),
					)
				}
			}
			await vm.stateManager.commit(false)
			checkpointed = false

			return {}
		} catch (e) {
			if (checkpointed) {
				try {
					const vm = await client.getVm()
					await vm.stateManager.revert()
				} catch (revertError) {
					client.logger.error({ revertError }, 'there was an error reverting setAccount state')
				}
			}
			errors.push(new InternalError('Unexpected error setting account', { cause: e }))
			return maybeThrowOnFail(throwOnFail, { errors })
		}
	}
