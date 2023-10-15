import { optimismGoerli } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof optimismGoerli, Error>}
 */
export const optimismGoerliEffect = wrapInEffect(optimismGoerli);