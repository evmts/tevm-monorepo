import { lineaTestnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof lineaTestnet, Error>}
 */
export const lineaTestnetEffect = wrapInEffect(lineaTestnet);