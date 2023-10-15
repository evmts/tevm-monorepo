import { holesky } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof holesky, Error>}
 */
export const holeskyEffect = wrapInEffect(holesky);