import { zetachainAthensTestnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof zetachainAthensTestnet, Error>}
 */
export const zetachainAthensTestnetEffect = wrapInEffect(zetachainAthensTestnet);