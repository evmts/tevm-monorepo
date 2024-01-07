import { Address } from '@ethereumjs/util'
import { callHandler } from './callHandler.js'
import { validateScriptParams } from '@tevm/zod'
import { decodeFunctionResult, encodeFunctionData } from 'viem'
import { accountHandler } from './accountHandler.js'

/**
 * Creates an ScriptHandler for handling script params with Ethereumjs EVM
 * @param {import('@ethereumjs/evm').EVM} evm
 * @returns {import("@tevm/api").ScriptHandler}
 */
export const scriptHandler = (evm) => async (params) => {
	/**
	 * @type {import('viem').Hex}
	 */
	let functionData = '0x'
	// Internally we overload this function to take raw data too for the jsonrpc handler
	if (/** @type any*/(params).data) {
		functionData = /** @type any*/(params).data
	} else {
		const errors = validateScriptParams(/** @type any*/(params))
		if (errors.length > 0) {
			return { errors, executionGasUsed: 0n, rawData: '0x' }
		}
	}

	try {
		functionData = functionData === '0x' ? encodeFunctionData(
			/** @type {any} */({
				abi: params.abi,
				functionName: params.functionName,
				args: params.args,
			}),
		) : functionData
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

	const randomBigInt = BigInt(Math.floor(Math.random() * 1_000_000_000_000_000))
	const scriptAddress = /** @type {import('viem').Address}*/(Address.generate(Address.fromString(`0x${'6969'.repeat(10)}`), randomBigInt).toString())

	const accountRes = await accountHandler(evm)({
		deployedBytecode: params.deployedBytecode,
		address: scriptAddress,
	})

	/**
	 * @type {import('@tevm/api').CallParams}
	 */
	const callParams = {
		...params,
		to: scriptAddress,
		skipBalance: params.skipBalance === undefined ? true : params.skipBalance,
		data: functionData,
	}
	delete callParams.deployedBytecode


	if ((accountRes.errors ?? []).length > 0) {
		// this should only fail if deployedBytecode is not formatted correctly
		return accountRes
	}

	const result = await callHandler(evm)(callParams)

	if ((result.errors ?? []).length > 0) {
		return result
	}

	// Internally we use runScript without encoding/decoding
	if (/** @type any*/(params).data) {
		return result
	}

	let decodedResult
	try {
		decodedResult = decodeFunctionResult(
			/** @type {any} */({
				abi: params.abi,
				data: result.rawData,
				functionName: params.functionName,
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
			...result,
			errors: [err],
		}
	}

	return {
		.../** @type any */ (result),
		data: decodedResult,
	}
}
