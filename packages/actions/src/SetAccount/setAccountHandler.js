import { AccountNotFoundError, InternalError } from '@tevm/errors'
import { EthjsAccount, EthjsAddress } from '@tevm/utils'
import { hexToBytes, keccak256 } from '@tevm/utils'
import { getAccountHandler } from '../GetAccount/getAccountHandler.js'
import { maybeThrowOnFail } from '../internal/maybeThrowOnFail.js'
import { validateSetAccountParams } from './validateSetAccountParams.js'

/**
 * Creates an SetAccountHandler for handling account params with Ethereumjs EVM
 * @param {import("@tevm/base-client").BaseClient} client
 * @param {object} [options]
 * @param {boolean} [options.throwOnFail] whether to default to throwing or not when errors occur
 * @returns {import('./SetAccountHandlerType.js').SetAccountHandler}
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

		const address = new EthjsAddress(hexToBytes(params.address))

		/**
		 * @type {Array<Promise<any>>}
		 */
		const promises = []
		try {
			const vm = await client.getVm()

			// check if account exists
			const account = await getAccountHandler(client)({ ...params, throwOnFail: false })
			if (account.errors?.length && !(account.errors[0] instanceof AccountNotFoundError)) {
				client.logger.error('there was an unexpected error getting account', account.errors)
				throw account.errors.length > 1 ? new AggregateError(account.errors) : account.errors[0]
			}

			promises.push(
				vm.stateManager.putAccount(
					address,
					new EthjsAccount(
						params.nonce ?? account?.nonce,
						params.balance ?? account?.nonce,
						(params.storageRoot && hexToBytes(params.storageRoot)) ??
							(account?.storageRoot !== undefined && account?.storageRoot !== '0x'
								? hexToBytes(account.storageRoot)
								: undefined),
						(params.deployedBytecode && hexToBytes(keccak256(params.deployedBytecode))) ??
							(account?.deployedBytecode !== undefined ? hexToBytes(keccak256(account.deployedBytecode)) : undefined),
					),
				),
			)
			if (params.deployedBytecode) {
				promises.push(vm.stateManager.putContractCode(address, hexToBytes(params.deployedBytecode)))
			}
			// state clears state first stateDiff does not
			if (params.state) {
				await vm.stateManager.clearContractStorage(address)
			}
			const state = params.state ?? params.stateDiff
			if (state) {
				for (const [key, value] of Object.entries(state)) {
					promises.push(
						vm.stateManager.putContractStorage(
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
