import { validateMineParams } from "./validateMineParams.js";

/**
 * @param {unknown} value
 * @returns {{ isValid: boolean, errors?: Array<import('@tevm/errors').BaseError> }}
 */
export const validateMineParamsObject = (value) => {
	const errors = validateMineParams(value);
	return {
		isValid: errors.length === 0,
		errors: errors.length > 0 ? errors : undefined,
	};
};

// For backward compatibility
export { validateMineParamsObject as zMineParams };
