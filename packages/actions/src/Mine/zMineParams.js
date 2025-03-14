import { validateMineParams } from "./validateMineParams.js";

/**
 * Validates Mine parameters
 * @param {unknown} value - The parameters to validate
 * @returns {{ isValid: boolean, errors?: Array<import('@tevm/errors').BaseError> }}
 */
export const validateMineParamsObject = (value) => {
  const errors = validateMineParams(value);
  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
};

// For backward compatibility to mimic Zod interface
export const zMineParams = {
  /**
   * Parse the mine parameters
   * @param {unknown} value - The value to parse
   * @returns {any} - The parsed value
   */
  parse: (value) => {
    const errors = validateMineParams(value);
    if (errors.length > 0) {
      throw new Error(errors[0]?.message || "Invalid mine parameters");
    }
    return value;
  },
};
