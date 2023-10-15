import { bxnTestnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof bxnTestnet, Error>}
 */
export const bxnTestnetEffect = wrapInEffect(bxnTestnet);