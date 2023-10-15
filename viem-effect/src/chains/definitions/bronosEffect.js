import { bronos } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof bronos, Error>}
 */
export const bronosEffect = wrapInEffect(bronos);