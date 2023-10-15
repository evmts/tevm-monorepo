import { plinga } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof plinga, Error>}
 */
export const plingaEffect = wrapInEffect(plinga);