import { eosTestnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof eosTestnet, Error>}
 */
export const eosTestnetEffect = wrapInEffect(eosTestnet);