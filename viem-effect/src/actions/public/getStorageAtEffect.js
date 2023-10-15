import { getStorageAt } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getStorageAt, import("viem/actions").GetStorageAtErrorType>}
 */
export const getStorageAtEffect = wrapInEffect(getStorageAt);