import { haqqTestedge2 } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof haqqTestedge2, Error>}
 */
export const haqqTestedge2Effect = wrapInEffect(haqqTestedge2);