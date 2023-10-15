import { oasys } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof oasys, Error>}
 */
export const oasysEffect = wrapInEffect(oasys);