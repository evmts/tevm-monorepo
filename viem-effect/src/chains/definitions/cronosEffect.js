import { cronos } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof cronos, Error>}
 */
export const cronosEffect = wrapInEffect(cronos);