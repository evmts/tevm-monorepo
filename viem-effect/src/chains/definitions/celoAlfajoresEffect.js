import { celoAlfajores } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof celoAlfajores, Error>}
 */
export const celoAlfajoresEffect = wrapInEffect(celoAlfajores);