import { DecodeFunctionDataError, InvalidRequestError, RevertError } from '@tevm/errors'
import { EthjsAddress } from '@tevm/utils'
import { decodeErrorResult, decodeFunctionResult, encodeFunctionData, isHex } from '@tevm/utils'
import { callHandler } from '../Call/callHandler.js'
import { maybeThrowOnFail } from '../internal/maybeThrowOnFail.js'
import { validateContractParams } from './validateContractParams.js'

/**
 * Creates an ContractHandler for handling contract params with Ethereumjs EVM
 * @param {import('@tevm/base-client').BaseClient} client
 * @param {object} [options]
 * @param {boolean} [options.throwOnFail] whether to default to throwing or not when errors occur
 * @returns {import("../Contract/ContractHandlerType.js").ContractHandler}
 */
export const contractHandler =
	(client, { throwOnFail: throwOnFailDefault = true } = {}) =>
	async (params) => {
		const errors = validateContractParams(/** @type any*/ (params))
		if (errors.length > 0) {
			client.logger.debug(errors, 'contractHandler: Invalid params')
			return maybeThrowOnFail(params.throwOnFail ?? throwOnFailDefault, {
				errors,
				executionGasUsed: 0n,
				rawData: '0x',
			})
		}
		const vm = await client.getVm().then((vm) => vm.deepCopy())

		const contract = params.to && (await vm.evm.stateManager.getContractCode(EthjsAddress.fromString(params.to)))
		const precompile = params.to && vm.evm.getPrecompile(EthjsAddress.fromString(params.to))
		if (contract && contract?.length === 0 && !precompile) {
			client.logger.debug(
				{ contract, precompile, to: params.to },
				'contractHandler: No contract bytecode nor precompile was found at specified `to` address. Unable to execute contract call.',
			)
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
			client.logger.debug(e, 'contractHandler: Unable to encode the abi, functionName, and args into hex data')
			const cause = /** @type {Error}*/ (e)
			const err = new InvalidRequestError(cause.message, { cause })
			return maybeThrowOnFail(params.throwOnFail ?? throwOnFailDefault, {
				rawData: '0x',
				executionGasUsed: 0n,
				errors: [err],
			})
		}

		client.logger.debug(
			functionData,
			'contractHandler: Encoded data, functionName, and args into hex data to execute call',
		)

		const result = await callHandler(
			{ ...client, getVm: async () => vm },
			{
				throwOnFail: throwOnFailDefault,
			},
		)({
			...params,
			throwOnFail: false,
			data: functionData,
		})

		if (result.errors && result.errors.length > 0) {
			result.errors = result.errors.map((err) => {
				if (isHex(err.message) && err instanceof RevertError) {
					client.logger.debug(err, 'contractHandler: Contract revert error. Decoding the error')
					/**
					 * @type {undefined |ReturnType<typeof decodeErrorResult>}
					 */
					let decodedError = undefined
					try {
						decodedError = decodeErrorResult(
							/** @type {any} */ ({
								abi: params.abi,
								data: err.message,
								functionName: params.functionName,
							}),
						)
						const message = `Revert: ${decodedError?.errorName ?? `There was a revert with no revert message ${err.message}`}`
						client.logger.debug(err, message)
						return new RevertError(message, { cause: err })
					} catch (e) {
						client.logger.debug(e, 'There was an error decoding error result')
						return err
					}
				}
				return err
			})
			client.logger.debug(result.errors, 'contractHandler: Execution errors')
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
			if (result.rawData === '0x') {
				throw new Error(
					'0x data returned from EVM with no error message. This indicates a the contract was missing or bug in Tevm if no other errors were thrown',
				)
			}
			client.logger.debug(e, 'contractHandler: Error decoding returned call data with provided abi and functionName')
			const cause = /** @type {Error}*/ (e)
			const err = new DecodeFunctionDataError(cause.message, { cause })
			return maybeThrowOnFail(params.throwOnFail ?? throwOnFailDefault, {
				debugContext: {
					abi: params.abi,
					rawData: result.rawData,
					functionName: params.functionName,
				},
				rawData: '0x',
				executionGasUsed: 0n,
				errors: [err],
			})
		}

		client.logger.debug(decodedResult, 'contractHandler: decoded data into a final result')

		return maybeThrowOnFail(params.throwOnFail ?? throwOnFailDefault, {
			.../** @type any */ (result),
			data: decodedResult,
		})
	}
