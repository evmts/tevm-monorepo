import { arbitrumGoerli } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof arbitrumGoerli, Error>}
 */
export const arbitrumGoerliEffect = wrapInEffect(arbitrumGoerli);