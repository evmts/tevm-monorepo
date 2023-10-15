import { mine } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof mine, import("viem/actions").MineErrorType>}
 */
export const mineEffect = wrapInEffect(mine);