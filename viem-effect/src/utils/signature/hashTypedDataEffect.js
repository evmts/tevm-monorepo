import { hashTypedData } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof hashTypedData, import("viem/utils").HashTypedDataErrorType>}
 */
export const hashTypedDataEffect = wrapInEffect(hashTypedData);