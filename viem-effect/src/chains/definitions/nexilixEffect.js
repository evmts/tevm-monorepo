import { nexilix } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof nexilix, Error>}
 */
export const nexilixEffect = wrapInEffect(nexilix);