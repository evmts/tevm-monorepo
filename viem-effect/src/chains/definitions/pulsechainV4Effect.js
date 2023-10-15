import { pulsechainV4 } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof pulsechainV4, Error>}
 */
export const pulsechainV4Effect = wrapInEffect(pulsechainV4);