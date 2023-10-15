import { neonDevnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof neonDevnet, Error>}
 */
export const neonDevnetEffect = wrapInEffect(neonDevnet);