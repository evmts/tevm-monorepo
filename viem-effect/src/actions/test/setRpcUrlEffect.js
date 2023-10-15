import { setRpcUrl } from "viem/test";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof setRpcUrl, import("viem/test").SetRpcUrlErrorType>}
 */
export const setRpcUrlEffect = wrapInEffect(setRpcUrl);