import { metisGoerli } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof metisGoerli, Error>}
 */
export const metisGoerliEffect = wrapInEffect(metisGoerli);