import { createError } from './createError.js'
import {
	Account as EthjsAccount,
	Address as EthjsAddress,
} from '@ethereumjs/util'
import { validateAccountParams } from '@tevm/zod'
import { hexToBytes } from 'viem'

/**
 * Creates an AccountHandler for handling account params with Ethereumjs EVM
 * @param {import('@ethereumjs/evm').EVM} evm
 * @returns {import('@tevm/api').AccountHandler}
 */
export const accountHandler = (evm) => async (action) => {
	/**
	 * @type {Array<import('@tevm/api').AccountError>}
	 */
	const errors = validateAccountParams(action)
	if (errors.length > 0) {
		return { errors }
	}

	const address = new EthjsAddress(hexToBytes(action.address))
	try {
		await evm.stateManager.putAccount(
			address,
			new EthjsAccount(
				action.nonce,
				action.balance,
				action.storageRoot && hexToBytes(action.storageRoot),
			),
		)
		if (action.deployedBytecode) {
			await evm.stateManager.putContractCode(address, hexToBytes(action.deployedBytecode))
		}
		return {}
	} catch (e) {
		errors.push(
			createError('UnexpectedError', String(e), JSON.stringify(action)),
		)
		return { errors }
	}
}
