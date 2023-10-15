import { rolluxTestnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof rolluxTestnet, Error>}
 */
export const rolluxTestnetEffect = wrapInEffect(rolluxTestnet);