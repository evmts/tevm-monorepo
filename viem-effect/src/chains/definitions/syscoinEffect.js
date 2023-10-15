import { syscoin } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof syscoin, Error>}
 */
export const syscoinEffect = wrapInEffect(syscoin);