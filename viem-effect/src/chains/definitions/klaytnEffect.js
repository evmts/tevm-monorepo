import { klaytn } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof klaytn, Error>}
 */
export const klaytnEffect = wrapInEffect(klaytn);