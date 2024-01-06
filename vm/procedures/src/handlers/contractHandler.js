import { callHandler } from './callHandler.js'
import { Address } from '@ethereumjs/util'
import { validateContractParams } from '@tevm/zod'
import { decodeFunctionResult, encodeFunctionData } from 'viem'

/**
 * Creates an ContractHandler for handling contract params with Ethereumjs EVM
 * @param {import('@ethereumjs/evm').EVM} evm
 * @returns {import("@tevm/api").ContractHandler}
 */
export const contractHandler = (evm) => async (action) => {
	const errors = validateContractParams(/** @type any*/(action))
	if (errors.length > 0) {
		return { errors, executionGasUsed: 0n, rawData: '0x' }
	}

	const contract = await evm.stateManager.getContractCode(
		Address.fromString(action.to),
	)
	if (contract.length === 0 && typeof contract !== 'function') {
		return {
			rawData: '0x',
			executionGasUsed: 0n,
			errors: [
				{
					_tag: 'InvalidRequestError',
					name: 'InvalidRequestError',
					message: `Contract at address ${action.to} does not exist`,
				},
			],
		}
	}

	let functionData
	try {
		functionData = encodeFunctionData(
			/** @type {any} */({
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

	const result = await callHandler(evm)({
		...action,
		data: functionData,
	})

	let decodedResult
	try {
		console.log('decoding', result.rawData, action.functionName)
		decodedResult = decodeFunctionResult(
			/** @type {any} */({
				abi: action.abi,
				data: result.rawData,
				functionName: action.functionName,
			}),
		)
	} catch (e) {
		console.error(e)
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
