import { nexi } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof nexi, Error>}
 */
export const nexiEffect = wrapInEffect(nexi);