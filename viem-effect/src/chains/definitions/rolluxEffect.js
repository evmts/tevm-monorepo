import { rollux } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof rollux, Error>}
 */
export const rolluxEffect = wrapInEffect(rollux);