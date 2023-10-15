import { linea } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof linea, Error>}
 */
export const lineaEffect = wrapInEffect(linea);