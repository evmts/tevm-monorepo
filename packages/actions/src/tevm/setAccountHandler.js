import { createError } from './createError.js'
import {
	Account as EthjsAccount,
	Address as EthjsAddress,
} from '@ethereumjs/util'
import { validateSetAccountParams } from '@tevm/zod'
import { hexToBytes, keccak256 } from 'viem'

/**
 * Creates an SetAccountHandler for handling account params with Ethereumjs EVM
 * @param {import('@ethereumjs/evm').EVM} evm
 * @returns {import('@tevm/actions-types').SetAccountHandler}
 */
export const setAccountHandler = (evm) => async (params) => {
	/**
	 * @type {Array<import('@tevm/errors').SetAccountError>}
	 */
	const errors = validateSetAccountParams(params)
	if (errors.length > 0) {
		return { errors }
	}

	const address = new EthjsAddress(hexToBytes(params.address))
	try {
		await evm.stateManager.putAccount(
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
			await evm.stateManager.putContractCode(
				address,
				hexToBytes(params.deployedBytecode),
			)
		}
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
