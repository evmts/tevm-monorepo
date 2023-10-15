import { qMainnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof qMainnet, Error>}
 */
export const qMainnetEffect = wrapInEffect(qMainnet);