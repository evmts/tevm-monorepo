import { custom } from "viem";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof custom, never>}
 */
export const customEffect = wrapInEffect(custom);