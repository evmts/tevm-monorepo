import { mev } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof mev, Error>}
 */
export const mevEffect = wrapInEffect(mev);