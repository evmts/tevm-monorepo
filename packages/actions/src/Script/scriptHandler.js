import { DecodeFunctionDataError, InvalidRequestError, RevertError } from '@tevm/errors'
import { contractHandler } from '../Contract/contractHandler.js'

/**
 * @deprecated can use `contractHandler` instead
 * Creates an ScriptHandler for handling script params with Ethereumjs EVM
 * @param {import("@tevm/base-client").BaseClient} client
 * @param {object} [options]
 * @param {boolean} [options.throwOnFail] whether to default to throwing or not when errors occur
 * @returns {import("../Script/ScriptHandlerType.js").ScriptHandler}
 */
export const scriptHandler =
	(client, options = {}) =>
	async (params) => {
		client.logger.debug(
			{
				functionName: params.functionName,
				abi: params.abi,
				args: params.args,
				deployedBytecode: params.deployedBytecode,
			},
			'Processing script...',
		)
		client.logger.warn('tevmScript is deprecated, use tevmContract instead')
		return contractHandler(client, options)(/** @type {any}*/ (params))
	}
