import { boba } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof boba, Error>}
 */
export const bobaEffect = wrapInEffect(boba);