import { telos } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof telos, Error>}
 */
export const telosEffect = wrapInEffect(telos);