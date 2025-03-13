import {
  InvalidAddressError,
  InvalidBalanceError,
  InvalidNonceError,
  InvalidRequestError,
} from "@tevm/errors";
import { zMineParams } from "./zMineParams.js";

/**
 * @typedef {InvalidAddressError| InvalidBalanceError| InvalidNonceError | InvalidRequestError} ValidateMineParamsError
 */

/**
 * @param {import('./MineParams.js').MineParams} action
 * @returns {Array<ValidateMineParamsError>}
 */
export const validateMineParams = (action) => {
  /**
   * @type {Array<ValidateMineParamsError>}
   */
  const errors = [];

  const parsedParams = zMineParams.safeParse(action);

  if (parsedParams.success === false) {
    const formattedErrors = parsedParams.error.format();
    formattedErrors._errors.forEach((error) => {
      errors.push(new InvalidRequestError(error));
    });
    if (formattedErrors.blockCount) {
      formattedErrors.blockCount._errors.forEach((error) => {
        errors.push(new InvalidAddressError(error));
      });
    }
    if (formattedErrors.interval) {
      formattedErrors.interval._errors.forEach((error) => {
        errors.push(new InvalidNonceError(error));
      });
    }
    if (formattedErrors.throwOnFail) {
      formattedErrors.throwOnFail._errors.forEach((error) => {
        errors.push(new InvalidBalanceError(error));
      });
    }
  }

  return errors;
};
