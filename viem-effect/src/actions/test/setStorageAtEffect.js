import { setStorageAt } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof setStorageAt, import("viem/actions").SetStorageAtErrorType>}
 */
export const setStorageAtEffect = wrapInEffect(setStorageAt);