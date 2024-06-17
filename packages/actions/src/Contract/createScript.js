import { InternalEvmError } from '@tevm/errors'
import { FeeMarketEIP1559Transaction } from '@tevm/tx'
import { runTx } from '@tevm/vm'
import { getAccountHandler } from '../GetAccount/getAccountHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'

/**
 * @internal
 * Creates a script with a randomly generated address
 * @param {import('@tevm/base-client').BaseClient} client
 * @param {import('@tevm/utils').Hex} code
 * @param {import('@tevm/utils').Address} [to]
 * @returns {Promise<{errors?: never, address: import('@tevm/utils').Address} | {address?: never, errors: Array<Error>}>}
 */
export const createScript = async (client, code, to) => {
	const vm = await client.getVm()
	try {
		const res = await runTx(vm)({
			tx: new FeeMarketEIP1559Transaction({
				data: code,
			}),
			skipNonce: true,
			skipBalance: true,
			skipBlockGasLimitValidation: true,
			skipHardForkValidation: true,
		})
		const deployedAddress = res.createdAddress
		if (!deployedAddress) {
			return {
				errors: [new InternalEvmError('Failed to create script')],
			}
		}
		if (to) {
			const account = await getAccountHandler(client)({
				throwOnFail: false,
				address: /** @type {import('abitype').Address}*/ (deployedAddress.toString()),
			})
			if (account.errors) {
				return {
					errors: account.errors,
				}
			}
			const setAccountRes = await setAccountHandler(client)({ ...account, throwOnFail: false })
			if (setAccountRes.errors) {
				return {
					errors: setAccountRes.errors,
				}
			}
			await vm.stateManager.deleteAccount(deployedAddress)
		}
		return {
			address: to ?? /** @type {import('@tevm/utils').Address}*/ (deployedAddress.toString()),
		}
	} catch (e) {
		return {
			errors: [/** @type any*/ (e)],
		}
	}
}
