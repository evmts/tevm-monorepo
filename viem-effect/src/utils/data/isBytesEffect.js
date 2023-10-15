import { isBytes } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof isBytes, import("viem/utils").IsBytesErrorType>}
 */
export const isBytesEffect = wrapInEffect(isBytes);