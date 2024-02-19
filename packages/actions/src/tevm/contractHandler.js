import { callHandler } from './callHandler.js'
import { maybeThrowOnFail } from './maybeThrowOnFail.js'
import { EthjsAddress } from '@tevm/utils'
import {
	decodeErrorResult,
	decodeFunctionResult,
	encodeFunctionData,
	isHex,
} from '@tevm/utils'
import { validateContractParams } from '@tevm/zod'

/**
 * Creates an ContractHandler for handling contract params with Ethereumjs EVM
 * @param {Pick<import('@tevm/base-client').BaseClient, 'vm'>} client
 * @param {object} [options]
 * @param {boolean} [options.throwOnFail] whether to default to throwing or not when errors occur
 * @returns {import("@tevm/actions-types").ContractHandler}
 */
export const contractHandler =
	(client, { throwOnFail: throwOnFailDefault = true } = {}) =>
	async (params) => {
		const errors = validateContractParams(/** @type any*/ (params))
		if (errors.length > 0) {
			return maybeThrowOnFail(params.throwOnFail ?? throwOnFailDefault, {
				errors,
				executionGasUsed: 0n,
				rawData: '0x',
			})
		}

		const contract = await client.vm.evm.stateManager.getContractCode(
			EthjsAddress.fromString(params.to),
		)
		const precompile =
			params.to &&
			client.vm.evm.getPrecompile(EthjsAddress.fromString(params.to))
		if (contract.length === 0 && !precompile) {
			return maybeThrowOnFail(params.throwOnFail ?? throwOnFailDefault, {
				rawData: '0x',
				executionGasUsed: 0n,
				errors: [
					{
						_tag: 'InvalidRequestError',
						name: 'InvalidRequestError',
						message: `Contract at address ${params.to} does not exist`,
					},
				],
			})
		}

		let functionData
		try {
			functionData = encodeFunctionData(
				/** @type {any} */ ({
					abi: params.abi,
					functionName: params.functionName,
					args: params.args,
				}),
			)
		} catch (e) {
			/**
			 * @type {import('@tevm/errors').InvalidRequestError}
			 */
			const err = {
				name: 'InvalidRequestError',
				_tag: 'InvalidRequestError',
				message: /** @type {Error}*/ (e).message,
			}
			return maybeThrowOnFail(params.throwOnFail ?? throwOnFailDefault, {
				rawData: '0x',
				executionGasUsed: 0n,
				errors: [err],
			})
		}

		const result = await callHandler(client, {
			throwOnFail: throwOnFailDefault,
		})({
			...params,
			throwOnFail: false,
			data: functionData,
		})

		if (result.errors && result.errors.length > 0) {
			result.errors = result.errors.map((err) => {
				if (isHex(err.message) && err._tag === 'revert') {
					const decodedError = decodeErrorResult(
						/** @type {any} */ ({
							abi: params.abi,
							data: err.message,
							functionName: params.functionName,
						}),
					)
					return {
						...err,
						message: `Revert: ${
							decodedError.errorName
						} ${decodedError.args.join(', ')}`,
					}
				}
				return err
			})
			return maybeThrowOnFail(params.throwOnFail ?? throwOnFailDefault, result)
		}

		let decodedResult
		try {
			decodedResult = decodeFunctionResult(
				/** @type {any} */ ({
					abi: params.abi,
					data: result.rawData,
					functionName: params.functionName,
				}),
			)
		} catch (e) {
			/**
			 * @type {import('@tevm/errors').ContractError}
			 */
			const err = {
				name: 'DecodeFunctionDataError',
				_tag: 'DecodeFunctionDataError',
				message: /** @type {Error}*/ (e).message,
			}
			return maybeThrowOnFail(params.throwOnFail ?? throwOnFailDefault, {
				rawData: '0x',
				executionGasUsed: 0n,
				errors: [err],
			})
		}

		return maybeThrowOnFail(params.throwOnFail ?? throwOnFailDefault, {
			.../** @type any */ (result),
			data: decodedResult,
		})
	}
