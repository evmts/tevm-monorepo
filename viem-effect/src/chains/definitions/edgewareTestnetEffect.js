import { edgewareTestnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof edgewareTestnet, Error>}
 */
export const edgewareTestnetEffect = wrapInEffect(edgewareTestnet);