import { canto } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof canto, Error>}
 */
export const cantoEffect = wrapInEffect(canto);