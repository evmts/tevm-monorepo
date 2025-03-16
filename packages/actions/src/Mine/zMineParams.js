import { validateMineParams } from './validateMineParams.js'
/**
 * @typedef {import('@tevm/errors').BaseError} BaseError
 * @typedef {import('./MineParams.js').MineParams} MineParams
 * @typedef {import('./validateMineParams.js').ValidateMineParamsError} ValidateMineParamsError
 */

/**
 * Validates Mine parameters
 * @param {unknown} value - The parameters to validate
 * @returns {{ isValid: boolean, errors: ValidateMineParamsError[] | undefined }}
 */
export const validateMineParamsObject = (value) => {
	/** @type {ValidateMineParamsError[]} */
	// @ts-ignore - We're ignoring type checking here for MineParams
	const errors = validateMineParams(value)
	return {
		isValid: errors.length === 0,
		errors: errors.length > 0 ? errors : undefined,
	}
}

/**
 * For backward compatibility to mimic Zod interface
 * @type {{parse: (value: unknown) => any}}
 */
export const zMineParams = {
	/**
	 * Parse the mine parameters
	 * @param {unknown} value - The value to parse
	 * @returns {any} - The parsed value
	 */
	parse: (value) => {
		/** @type {ValidateMineParamsError[]} */
		// @ts-ignore - We're ignoring type checking here for MineParams
		const errors = validateMineParams(value)
		if (errors.length > 0) {
			throw new Error(errors[0]?.message || 'Invalid mine parameters')
		}
		return value
	},
}
