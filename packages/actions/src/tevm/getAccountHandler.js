import { createError } from './createError.js'
import { maybeThrowOnFail } from './maybeThrowOnFail.js'
import { EthjsAddress } from '@tevm/utils'
import { bytesToHex, hexToBytes } from '@tevm/utils'
import { validateGetAccountParams } from '@tevm/zod'

/**
 * Creates an GetAccountHandler for handling account params with Ethereumjs VM
 * @param {Pick<import('@tevm/base-client').BaseClient, 'vm'>} client
 * @param {object} [options]
 * @param {boolean} [options.throwOnFail] whether to default to throwing or not when errors occur
 * @returns {import('@tevm/actions-types').GetAccountHandler}
 */
export const getAccountHandler =
	(client, options = {}) =>
	async ({ throwOnFail = options.throwOnFail ?? true, ...params }) => {
		/**
		 * @type {Array<import('@tevm/errors').GetAccountError>}
		 */
		const errors = validateGetAccountParams(params)
		if (errors.length > 0) {
			return maybeThrowOnFail(throwOnFail, {
				errors,
				address: params.address,
				balance: 0n,
				/**
				 * @type {`0x${string}`}
				 */
				storageRoot: '0x',
				nonce: 0n,
				/**
				 * @type {`0x${string}`}
				 */
				deployedBytecode: '0x',
			})
		}

		const address = new EthjsAddress(hexToBytes(params.address))
		try {
			const res = await client.vm.stateManager.getAccount(address)
			if (!res) {
				return maybeThrowOnFail(throwOnFail, {
					address: params.address,
					balance: 0n,
					/**
					 * @type {`0x${string}`}
					 */
					storageRoot: '0x',
					nonce: 0n,
					/**
					 * @type {`0x${string}`}
					 */
					deployedBytecode: '0x',
					errors: [
						createError(
							'AccountNotFoundError',
							`account ${params.address} not found`,
						),
					],
				})
			}
			const code =
				res?.codeHash !== undefined
					? bytesToHex(await client.vm.stateManager.getContractCode(address))
					: '0x'
			return {
				// TODO some of these fields are not in the api and should be added to @tevm/actions-types
				address: params.address,
				balance: res.balance,
				codeHash: bytesToHex(res.codeHash),
				isContract: res.isContract(),
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
			return maybeThrowOnFail(throwOnFail, {
				errors,
				address: params.address,
				balance: 0n,
				/**
				 * @type {`0x${string}`}
				 */
				storageRoot: '0x',
			})
		}
	}
