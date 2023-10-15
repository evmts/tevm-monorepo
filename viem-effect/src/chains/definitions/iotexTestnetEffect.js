import { iotexTestnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof iotexTestnet, Error>}
 */
export const iotexTestnetEffect = wrapInEffect(iotexTestnet);