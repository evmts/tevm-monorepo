import { taraxa } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof taraxa, Error>}
 */
export const taraxaEffect = wrapInEffect(taraxa);