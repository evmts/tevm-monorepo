import { isBytes } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof isBytes, Error>}
 */
export const isBytesEffect = wrapInEffect(isBytes);