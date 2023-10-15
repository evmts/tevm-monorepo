import { metis } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof metis, Error>}
 */
export const metisEffect = wrapInEffect(metis);