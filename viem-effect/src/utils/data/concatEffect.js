import { concat } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof concat, Error>}
 */
export const concatEffect = wrapInEffect(concat);