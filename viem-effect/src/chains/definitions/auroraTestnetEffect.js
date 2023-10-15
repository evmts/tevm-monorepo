import { auroraTestnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof auroraTestnet, Error>}
 */
export const auroraTestnetEffect = wrapInEffect(auroraTestnet);