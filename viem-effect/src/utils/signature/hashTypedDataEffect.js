import { hashTypedData } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * // I manually updated this
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof hashTypedData, import("viem/utils").HashMessageErrorType>}
 */
export const hashTypedDataEffect = wrapInEffect(hashTypedData);
