import { mainnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof mainnet, Error>}
 */
export const mainnetEffect = wrapInEffect(mainnet);