import { sign } from "viem/accounts";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof sign, Error>}
 */
export const signEffect = wrapInEffect(sign);