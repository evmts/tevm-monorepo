import { InvalidRequestError, RevertError } from '@tevm/errors'
import { decodeErrorResult, encodeDeployData, isHex } from '@tevm/utils'
import { callHandler } from '../Call/callHandler.js'
import { maybeThrowOnFail } from '../internal/maybeThrowOnFail.js'

/**
 * Creates a tree-shakable instance of `deployHandler` for handling the deployment of contracts to TEVM.
 * This function uses `callHandler` under the hood to execute the deployment.
 *
 * Note: This is the internal logic used by higher-level APIs such as `tevmDeploy`.
 *
 * @param {import('@tevm/node').TevmNode} client
 * @param {object} [options]
 * @param {boolean} [options.throwOnFail=true]
 * @returns {import("../Deploy/DeployHandlerType.js").DeployHandler}
 * @throws {import('./TevmCallError.js').TevmCallError} If `throwOnFail` is true; otherwise returned in the result.
 *
 * @example
 * ```typescript
 * import { createTevmNode } from 'tevm/node'
 * import { deployHandler } from 'tevm/actions'
 *
 * const client = createTevmNode()
 *
 * const deploy = deployHandler(client)
 *
 * const res = await deploy({
 *   bytecode: '0x...', // Contract bytecode
 *   abi: [{...}], // ABI array
 *   args: [1, 2, 3], // Constructor arguments
 *   createTransaction: true,
 * })
 * ```
 */
export const deployHandler =
	(client, { throwOnFail: throwOnFailDefault = true } = {}) =>
	async (params) => {
		client.logger.debug({ params }, 'deployHandler called with params')
		// TODO Moving fast atm we should ideally add validators to zod
		let deployData
		try {
			deployData = encodeDeployData(
				/** @type {any} */ ({
					abi: params.abi,
					bytecode: params.bytecode,
					args: params.args,
				}),
			)
		} catch (e) {
			client.logger.debug(e, 'deployHandler: Unable to encode the abi, functionName, and args into hex data')
			const cause = /** @type {Error}*/ (e)
			const err = new InvalidRequestError(cause.message, { cause })

			return maybeThrowOnFail(params.throwOnFail ?? throwOnFailDefault, {
				/**
				 * @type {import('@tevm/utils').Hex}
				 */
				rawData: '0x',
				executionGasUsed: 0n,
				errors: [err],
			})
		}

		client.logger.debug({ deployData }, 'deployHandler: Encoded abi bytecode and args into hex data to execute call')

		const transactionDefaults =
			params.createTransaction === undefined &&
			params.addToMempool === undefined &&
			params.addToBlockchain === undefined
				? client.miningConfig.type === 'auto'
					? { addToBlockchain: true }
					: { addToMempool: true }
				: {}

		const result = await callHandler(client, {
			throwOnFail: throwOnFailDefault,
		})({
			...params,
			// Unlike most calls deployments default to creating a transaction.
			...transactionDefaults,
			data: deployData,
			throwOnFail: false,
		})

		if (result.errors && result.errors.length > 0) {
			result.errors = result.errors.map((err) => {
				// The revert payload lives in result.rawData (not err.message, which is the generic 'revert' string)
				if (isHex(result.rawData) && err instanceof RevertError) {
					try {
						client.logger.debug(err, 'deployHandler: Constructor revert error. Decoding the error')
						const decodedError = decodeErrorResult(
							/** @type {any} */ ({
								abi: params.abi,
								data: result.rawData,
								functionName: 'constructor',
							}),
						)
						// Use a BigInt-safe replacer because decoded args frequently contain bigints
						const message = `Revert: ${decodedError.errorName} ${JSON.stringify(decodedError, (_key, value) =>
							typeof value === 'bigint' ? value.toString() : value,
						)}`
						client.logger.debug({ message }, 'Revert message decoded')
						return new RevertError(message, { cause: /** @type any*/ (err) })
					} catch (e) {
						client.logger.warn(e, 'Unable to decode revert data')
						return err
					}
				}
				return err
			})
			client.logger.debug(result.errors, 'contractHandler: Execution errors')
			return maybeThrowOnFail(params.throwOnFail ?? throwOnFailDefault, result)
		}

		return maybeThrowOnFail(params.throwOnFail ?? throwOnFailDefault, result)
	}
