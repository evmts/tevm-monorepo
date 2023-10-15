import { encodeErrorResult } from "viem/contract";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof encodeErrorResult, Error>}
 */
export const encodeErrorResultEffect = wrapInEffect(encodeErrorResult);