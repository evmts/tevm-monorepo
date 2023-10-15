import { baseGoerli } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof baseGoerli, Error>}
 */
export const baseGoerliEffect = wrapInEffect(baseGoerli);