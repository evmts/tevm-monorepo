import { pad } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof pad, import("viem/utils").PadErrorType>}
 */
export const padEffect = wrapInEffect(pad);