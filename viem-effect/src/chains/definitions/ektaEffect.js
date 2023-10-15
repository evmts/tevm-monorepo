import { ekta } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof ekta, Error>}
 */
export const ektaEffect = wrapInEffect(ekta);