import { setCoinbase } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof setCoinbase, import("viem/actions").SetCoinbaseErrorType>}
 */
export const setCoinbaseEffect = wrapInEffect(setCoinbase);