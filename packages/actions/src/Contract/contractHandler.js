import { createAddress } from '@tevm/address'
import { DecodeFunctionDataError, InvalidRequestError, RevertError } from '@tevm/errors'
import { decodeFunctionResult, encodeFunctionData, isHex } from '@tevm/utils'
import { RawContractError, getContractError } from 'viem'
import { callHandler } from '../Call/callHandler.js'
import { maybeThrowOnFail } from '../internal/maybeThrowOnFail.js'
import { validateContractParams } from './validateContractParams.js'

/**
 * Creates a tree-shakable instance of `contractHandler` for handling contract interactions with the Ethereumjs EVM.
 * This function uses `callHandler` under the hood to execute contract calls.
 *
 * Note: This is the internal logic used by higher-level APIs such as `tevmContract`.
 *
 * @param {import('@tevm/node').TevmNode} client - The TEVM base client instance.
 * @param {object} [options] - Optional parameters.
 * @param {boolean} [options.throwOnFail=true] - Whether to throw an error on failure.
 * @returns {import("../Contract/ContractHandlerType.js").ContractHandler} The contract handler function.
 * @throws {import('./TevmCallError.js').TevmCallError} If `throwOnFail` is true, returns `TevmCallError` as value.
 *
 * @example
 * ```typescript
 * import { createTevmNode } from 'tevm/node'
 * import { contractHandler } from 'tevm/actions'
 *
 * const client = createTevmNode()
 *
 * const contract = contractHandler(client)
 *
 * const res = await contract({
 *   to: `0x${'69'.repeat(20)}`,
 *   abi: [{...}], // ABI array
 *   functionName: 'myFunction',
 *   args: [1, 2, 3],
 * })
 * ```
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
		const vm = await client.getVm()

		const contract = params.to && (await vm.evm.stateManager.getCode(createAddress(params.to)))
		const precompile = params.to && vm.evm.getPrecompile(createAddress(params.to))
		if (!params.deployedBytecode && !params.code && contract && contract?.length === 0 && !precompile) {
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

		const result = await callHandler(client, {
			throwOnFail: throwOnFailDefault,
		})({
			...params,
			throwOnFail: false,
			data: functionData,
		})

		if (result.errors && result.errors.length > 0) {
			result.errors = result.errors.map((err) => {
				if (isHex(result.rawData) && err instanceof RevertError) {
					client.logger.debug(err, 'contractHandler: Contract revert error. Decoding the error')
					try {
						if (!params.functionName) throw err // we can't decode the error so we'll just return the raw data
						// Create a raw contract error in a format friendly to getContractError, which will also create a sensible causality chain
						const rawContractError = new RawContractError({ data: result.rawData })
						const contractError = getContractError(rawContractError, {
							abi: /** @type {import('@tevm/utils').Abi} */ (params.abi),
							args: params.args,
							address: params.to,
							docsPath: err.docsPath,
							functionName: params.functionName,
							sender: params.caller ?? params.origin,
						})

						const message = contractError.message
						client.logger.debug(err, message)
						return new RevertError(message, { cause: contractError })
					} catch (e) {
						client.logger.debug(e, 'There was an error decoding error result')
						return new RevertError(err.message, { cause: err, raw: result.rawData })
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
				return maybeThrowOnFail(params.throwOnFail ?? throwOnFailDefault, {
					errors: [
						new Error(
							'0x data returned from EVM with no error message. This indicates a the contract was missing or bug in Tevm if no other errors were thrown',
						),
					],
					rawData: '0x',
					executionGasUsed: 0n,
				})
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
