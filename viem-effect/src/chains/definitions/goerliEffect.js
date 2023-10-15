import { goerli } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof goerli, Error>}
 */
export const goerliEffect = wrapInEffect(goerli);