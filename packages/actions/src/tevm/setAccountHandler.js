import { createError } from './createError.js'
import { EthjsAccount, EthjsAddress } from '@tevm/utils'
import { hexToBytes, keccak256 } from '@tevm/utils'
import { validateSetAccountParams } from '@tevm/zod'

/**
 * Creates an SetAccountHandler for handling account params with Ethereumjs EVM
 * @param {Pick<import('@tevm/base-client').BaseClient, 'vm'>} client
 * @returns {import('@tevm/actions-types').SetAccountHandler}
 */
export const setAccountHandler = (client) => async (params) => {
	/**
	 * @type {Array<import('@tevm/errors').SetAccountError>}
	 */
	const errors = validateSetAccountParams(params)
	if (errors.length > 0) {
		return { errors }
	}

	const address = new EthjsAddress(hexToBytes(params.address))
	try {
		await client.vm.stateManager.putAccount(
			address,
			new EthjsAccount(
				params.nonce,
				params.balance,
				params.storageRoot && hexToBytes(params.storageRoot),
				params.deployedBytecode &&
					hexToBytes(keccak256(params.deployedBytecode)),
			),
		)
		if (params.deployedBytecode) {
			await client.vm.stateManager.putContractCode(
				address,
				hexToBytes(params.deployedBytecode),
			)
		}
		await client.vm.stateManager.checkpoint()
		await client.vm.stateManager.commit()
		// TODO offer way of setting contract storage with evm.stateManager.putContractStorage
		return {}
	} catch (e) {
		errors.push(
			createError(
				'UnexpectedError',
				typeof e === 'string'
					? e
					: e instanceof Error
					? e.message
					: 'unknown error',
			),
		)
		return { errors }
	}
}
