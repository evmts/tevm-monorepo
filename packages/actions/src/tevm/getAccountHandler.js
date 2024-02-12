import { createError } from './createError.js'
import { Address as EthjsAddress } from '@ethereumjs/util'
import { validateGetAccountParams } from '@tevm/zod'
import { bytesToHex, hexToBytes } from 'viem'

/**
 * Creates an GetAccountHandler for handling account params with Ethereumjs VM
 * @param {import('@tevm/vm').TevmVm} vm
 * @returns {import('@tevm/actions-types').GetAccountHandler}
 */
export const getAccountHandler = (vm) => async (params) => {
	/**
	 * @type {Array<import('@tevm/errors').GetAccountError>}
	 */
	const errors = validateGetAccountParams(params)
	if (errors.length > 0) {
		return {
			errors,
			address: params.address,
			balance: 0n,
			storageRoot: '0x',
			nonce: 0n,
			deployedBytecode: '0x',
		}
	}

	const address = new EthjsAddress(hexToBytes(params.address))
	try {
		const res = await vm.stateManager.getAccount(address)
		if (!res) {
			return {
				address: params.address,
				balance: 0n,
				storageRoot: '0x',
				nonce: 0n,
				deployedBytecode: '0x',
				errors: [
					createError(
						'AccountNotFoundError',
						`account ${params.address} not found`,
					),
				],
			}
		}
		const code =
			res?.codeHash !== undefined
				? bytesToHex(await vm.stateManager.getContractCode(address))
				: '0x'
		return {
			// TODO some of these fields are not in the api and should be added to @tevm/actions-types
			address: params.address,
			balance: res.balance,
			codeHash: res.codeHash,
			isContract: res.isContract,
			isEmpty: res.isEmpty(),
			deployedBytecode: code,
			nonce: res.nonce,
			storageRoot: bytesToHex(res.storageRoot),
		}
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
		return {
			errors,
			address: params.address,
			balance: 0n,
			storageRoot: '0x',
		}
	}
}
