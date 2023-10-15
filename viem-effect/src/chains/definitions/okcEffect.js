import { okc } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof okc, Error>}
 */
export const okcEffect = wrapInEffect(okc);