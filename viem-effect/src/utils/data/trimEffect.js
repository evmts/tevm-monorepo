import { trim } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof trim, import("viem/utils").TrimErrorType>}
 */
export const trimEffect = wrapInEffect(trim);