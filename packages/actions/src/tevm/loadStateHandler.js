import { createError } from './createError.js'
import { Account, Address } from '@ethereumjs/util'
import { validateLoadStateParams } from '@tevm/zod'
import { fromRlp, hexToBytes, isHex } from 'viem'

/**
 * @param {import("@ethereumjs/vm").VM} vm
 * @returns {import('@tevm/actions-types').LoadStateHandler}
 */
export const loadStateHandler = (vm) => async (params) => {
	const errors = validateLoadStateParams(params)
	if (errors.length > 0) {
		return { errors }
	}

	const tevmState = params.state
	try {
		for (const [k, v] of Object.entries(tevmState)) {
			const { nonce, balance, storageRoot, codeHash, storage } = v
			const account = new Account(
				// replace with just the var
				nonce,
				balance,
				hexToBytes(storageRoot, { size: 32 }),
				hexToBytes(codeHash, { size: 32 }),
			)
			const address = Address.fromString(k)
			vm.stateManager.putAccount(address, account)
			if (storage !== undefined) {
				for (const [storageKey, storageData] of Object.entries(storage)) {
					const key = hexToBytes(
						isHex(storageKey) ? storageKey : `0x${storageKey}`,
					)
					const encodedStorageData = fromRlp(
						isHex(storageData) ? storageData : `0x${storageData}`,
					)
					const data = hexToBytes(
						isHex(encodedStorageData)
							? encodedStorageData
							: `0x${encodedStorageData}`,
					)
					vm.stateManager.putContractStorage(address, key, data)
				}
			}
			await vm.stateManager.checkpoint()
			await vm.stateManager.commit()
		}
		return {}
	} catch (e) {
		return {
			errors: [
				createError(
					'UnexpectedError',
					typeof e === 'string'
						? e
						: e instanceof Error
						? e.message
						: 'unknown error',
				),
			],
		}
	}
}
