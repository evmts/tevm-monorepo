import { isValidCallEvents } from '../common/zCallEvents.js'
import { isValidAddress } from '../internal/zod/zAddress.js'
import { isValidBlockParam } from '../internal/zod/zBlockParam.js'
import { isValidHex } from '../internal/zod/zHex.js'
import { isValidBaseParams } from './zBaseParams.js'

/**
 * Valid createTransaction values
 */
const VALID_CREATE_TRANSACTION_VALUES = [true, false, 'on-success', 'always', 'never']

/**
 * Validates base call parameters
 * @param {import('../BaseCall/BaseCallParams.js').BaseCallParams} params - The parameters to validate
 * @returns {object} The validated parameters
 */
export const validateBaseCallParams = (params) => {
	if (params === null || typeof params !== 'object') {
		throw new Error('Parameters must be an object')
	}

	// Validate base params first
	if (!isValidBaseParams(params)) {
		throw new Error('Invalid base parameters')
	}

	// Validate call events
	if (!isValidCallEvents(params)) {
		throw new Error('Invalid call events')
	}

	const {
		createTrace,
		createAccessList,
		createTransaction,
		skipBalance,
		gasRefund,
		blockTag,
		gasPrice,
		origin,
		caller,
		gas,
		value,
		depth,
		selfdestruct,
		to,
		blobVersionedHashes,
		stateOverrideSet,
		blockOverrideSet,
		maxFeePerGas,
		maxPriorityFeePerGas,
	} = params

	// Boolean validations
	if (createTrace !== undefined && typeof createTrace !== 'boolean') {
		throw new Error('createTrace must be a boolean')
	}

	if (createAccessList !== undefined && typeof createAccessList !== 'boolean') {
		throw new Error('createAccessList must be a boolean')
	}

	if (createTransaction !== undefined && !VALID_CREATE_TRANSACTION_VALUES.includes(createTransaction)) {
		throw new Error('createTransaction must be a boolean or one of: "on-success", "always", "never"')
	}

	if (skipBalance !== undefined && typeof skipBalance !== 'boolean') {
		throw new Error('skipBalance must be a boolean')
	}

	// Bigint validations
	if (gasRefund !== undefined) {
		if (typeof gasRefund !== 'bigint') {
			throw new Error('gasRefund must be a bigint')
		}
		if (gasRefund < 0n) {
			throw new Error('gasRefund must be non-negative')
		}
	}

	if (gasPrice !== undefined && typeof gasPrice !== 'bigint') {
		throw new Error('gasPrice must be a bigint')
	}

	if (gas !== undefined) {
		if (typeof gas !== 'bigint') {
			throw new Error('gas must be a bigint')
		}
		if (gas < 0n) {
			throw new Error('gas must be non-negative')
		}
	}

	if (value !== undefined) {
		if (typeof value !== 'bigint') {
			throw new Error('value must be a bigint')
		}
		if (value < 0n) {
			throw new Error('value must be non-negative')
		}
	}

	if (maxFeePerGas !== undefined && typeof maxFeePerGas !== 'bigint') {
		throw new Error('maxFeePerGas must be a bigint')
	}

	if (maxPriorityFeePerGas !== undefined && typeof maxPriorityFeePerGas !== 'bigint') {
		throw new Error('maxPriorityFeePerGas must be a bigint')
	}

	// Number validations
	if (depth !== undefined) {
		if (typeof depth !== 'number') {
			throw new Error('depth must be a number')
		}
		if (depth < 0 || !Number.isInteger(depth)) {
			throw new Error('depth must be a non-negative integer')
		}
	}

	// Address validations
	if (origin !== undefined && !isValidAddress(origin)) {
		throw new Error('origin must be a valid Ethereum address')
	}

	if (caller !== undefined && !isValidAddress(caller)) {
		throw new Error('caller must be a valid Ethereum address')
	}

	if (to !== undefined && !isValidAddress(to)) {
		throw new Error('to must be a valid Ethereum address')
	}

	// Set validation
	if (selfdestruct !== undefined) {
		if (!(selfdestruct instanceof Set)) {
			throw new Error('selfdestruct must be a Set')
		}

		for (const address of selfdestruct) {
			if (!isValidAddress(address)) {
				throw new Error('All addresses in selfdestruct must be valid Ethereum addresses')
			}
		}
	}

	// Block parameter validation
	if (blockTag !== undefined && !isValidBlockParam(blockTag)) {
		throw new Error('blockTag must be a valid block parameter')
	}

	// Array validation
	if (blobVersionedHashes !== undefined) {
		if (!Array.isArray(blobVersionedHashes)) {
			throw new Error('blobVersionedHashes must be an array')
		}

		for (const hash of blobVersionedHashes) {
			if (!isValidHex(hash)) {
				throw new Error('All entries in blobVersionedHashes must be valid hex strings')
			}
		}
	}

	// State override set validation - this is a simplified check
	if (stateOverrideSet !== undefined && (stateOverrideSet === null || typeof stateOverrideSet !== 'object')) {
		throw new Error('stateOverrideSet must be an object')
	}

	// Block override set validation - this is a simplified check
	if (blockOverrideSet !== undefined && (blockOverrideSet === null || typeof blockOverrideSet !== 'object')) {
		throw new Error('blockOverrideSet must be an object')
	}

	return params
}

/**
 * Checks if the input contains valid base call parameters
 * @param {unknown} params - The parameters to check
 * @returns {boolean} True if the parameters are valid
 */
export const isValidBaseCallParams = (params) => {
	try {
		validateBaseCallParams(params)
		return true
	} catch (error) {
		return false
	}
}
