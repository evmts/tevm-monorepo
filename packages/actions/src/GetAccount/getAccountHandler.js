import { createAddress } from '@tevm/address'
import { AccountNotFoundError, ForkError, InternalError } from '@tevm/errors'
import { bytesToHex } from '@tevm/utils'
import { cloneVmWithBlockTag } from '../Call/cloneVmWithBlock.js'
import { getPendingClient } from '../internal/getPendingClient.js'
import { maybeThrowOnFail } from '../internal/maybeThrowOnFail.js'
import { validateGetAccountParams } from './validateGetAccountParams.js'

/**
 * Creates an GetAccountHandler for handling account params with Ethereumjs VM
 * @param {import("@tevm/node").TevmNode} client
 * @param {object} [options]
 * @param {boolean} [options.throwOnFail] whether to default to throwing or not when errors occur
 * @returns {import('../GetAccount/GetAccountHandlerType.js').GetAccountHandler}
 */
export const getAccountHandler =
	(client, options = {}) =>
	async ({ throwOnFail = options.throwOnFail ?? true, ...params }) => {
		const vm = await client.getVm()
		/**
		 * @type {Array<import('../GetAccount/TevmGetAccountError.js').TevmGetAccountError>}
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
				/**
				 * @type {`0x${string}`}
				 */
				codeHash: '0x',
				isContract: false,
				isEmpty: true,
			})
		}

		const address = createAddress(params.address)
		try {
			if (params.blockTag === 'pending') {
				const mineResult = await getPendingClient(client)
				if (mineResult.errors) {
					return maybeThrowOnFail(throwOnFail, {
						errors: mineResult.errors,
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
						/**
						 * @type {`0x${string}`}
						 */
						codeHash: '0x',
						isContract: false,
						isEmpty: true,
					})
				}
				return getAccountHandler(mineResult.pendingClient, options)({ throwOnFail, ...params, blockTag: 'latest' })
			}
			if (params.blockTag !== 'latest' && params.blockTag !== undefined) {
				const block = await vm.blockchain.getBlockByTag(params.blockTag)
				const clonedVm = await cloneVmWithBlockTag(client, block)
				if (clonedVm instanceof ForkError || clonedVm instanceof InternalError) {
					return maybeThrowOnFail(throwOnFail, {
						errors: [clonedVm],
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
						/**
						 * @type {`0x${string}`}
						 */
						codeHash: '0x',
						isContract: false,
						isEmpty: true,
					})
				}
				return getAccountHandler(
					{ ...client, getVm: () => Promise.resolve(clonedVm) },
					options,
				)({ throwOnFail, ...params, blockTag: 'latest' })
			}
			const res = await vm.stateManager.getAccount(address)
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
					errors: [new AccountNotFoundError(`account ${params.address} not found`)],
					/**
					 * @type {`0x${string}`}
					 */
					codeHash: '0x',
					isContract: false,
					isEmpty: true,
				})
			}
			const code = res?.codeHash !== undefined ? bytesToHex(await vm.stateManager.getCode(address)) : '0x'

			return {
				// TODO some of these fields are not in the api and should be added to @tevm/actions
				address: params.address,
				balance: res.balance,
				codeHash: bytesToHex(res.codeHash),
				isContract: res.isContract(),
				isEmpty: res.isEmpty(),
				deployedBytecode: code,
				nonce: res.nonce,
				storageRoot: bytesToHex(res.storageRoot),
				...(params.returnStorage
					? {
							storage: Object.fromEntries(
								Object.entries(await vm.stateManager.dumpStorage(address)).map(([key, value]) => [
									`0x${key}`,
									/** @type {import('../common/Hex.js').Hex}*/ (value),
								]),
							),
						}
					: {}),
			}
		} catch (e) {
			let err = e
			// TODO this isn't clean
			// What we are doing here is checking if we threw a known error or not
			if (typeof e !== 'object' || e === null || !('_tag' in e)) {
				err = new InternalError('UnexpectedError in getAccountHandler', { cause: /** @type {any}*/ (e) })
			}
			errors.push(/** @type any*/ (err))
			return maybeThrowOnFail(throwOnFail, {
				errors,
				address: params.address,
				balance: 0n,
				/**
				 * @type {`0x${string}`}
				 */
				storageRoot: '0x',
				/**
				 * @type {`0x${string}`}
				 */
				codeHash: '0x',
				nonce: 0n,
				/**
				 * @type {`0x${string}`}
				 */
				deployedBytecode: '0x',
				isContract: false,
				isEmpty: true,
			})
		}
	}
