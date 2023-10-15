import { moonbaseAlpha } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof moonbaseAlpha, Error>}
 */
export const moonbaseAlphaEffect = wrapInEffect(moonbaseAlpha);