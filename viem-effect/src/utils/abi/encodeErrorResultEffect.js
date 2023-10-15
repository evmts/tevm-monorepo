import { encodeErrorResult } from "viem/contract";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof encodeErrorResult, import("viem/contract").EncodeErrorResultErrorType>}
 */
export const encodeErrorResultEffect = wrapInEffect(encodeErrorResult);