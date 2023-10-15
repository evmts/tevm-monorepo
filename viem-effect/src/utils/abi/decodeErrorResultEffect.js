import { decodeErrorResult } from "viem/contract";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof decodeErrorResult, Error>}
 */
export const decodeErrorResultEffect = wrapInEffect(decodeErrorResult);