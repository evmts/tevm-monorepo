import { callHandler } from './callHandler.js'
import { validateScriptParams } from '@tevm/zod'
import { decodeFunctionResult, encodeFunctionData } from 'viem'

/**
 * Creates an ScriptHandler for handling script params with Ethereumjs EVM
 * @param {import('@ethereumjs/evm').EVM} evm
 * @returns {import("@tevm/api").ScriptHandler}
 */
export const scriptHandler = (evm) => async (action) => {
	const errors = validateScriptParams(/** @type any*/ (action))
	if (errors.length > 0) {
		return { errors, executionGasUsed: 0n, rawData: '0x' }
	}

	let functionData
	try {
		functionData = encodeFunctionData(
			/** @type {any} */ ({
				abi: action.abi,
				functionName: action.functionName,
				args: action.args,
			}),
		)
	} catch (e) {
		/**
		 * @type {import('@tevm/api').InvalidRequestError}
		 */
		const err = {
			name: 'InvalidRequestError',
			_tag: 'InvalidRequestError',
			message: /** @type {Error}*/ (e).message,
		}
		return {
			rawData: '0x',
			executionGasUsed: 0n,
			errors: [err],
		}
	}

	/**
	 * @type {import('@tevm/api').CallParams}
	 */
	const callParams = {
		...action,
		skipBalance: action.skipBalance === undefined ? true : action.skipBalance,
		data: functionData,
	}

	const result = await callHandler(evm)(callParams)

	if ((result.errors ?? []).length > 0) {
		return result
	}

	let decodedResult
	try {
		decodedResult = decodeFunctionResult(
			/** @type {any} */ ({
				abi: action.abi,
				data: result.rawData,
				functionName: action.functionName,
			}),
		)
	} catch (e) {
		/**
		 * @type {import('@tevm/api').ContractError}
		 */
		const err = {
			name: 'DecodeFunctionDataError',
			_tag: 'DecodeFunctionDataError',
			message: /** @type {Error}*/ (e).message,
		}
		return {
			rawData: '0x',
			executionGasUsed: 0n,
			errors: [err],
		}
	}

	return {
		.../** @type any */ (result),
		data: decodedResult,
	}
}
