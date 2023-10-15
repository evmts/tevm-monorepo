import { optimism } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof optimism, Error>}
 */
export const optimismEffect = wrapInEffect(optimism);