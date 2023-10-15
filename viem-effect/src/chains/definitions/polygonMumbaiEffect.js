import { polygonMumbai } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof polygonMumbai, Error>}
 */
export const polygonMumbaiEffect = wrapInEffect(polygonMumbai);