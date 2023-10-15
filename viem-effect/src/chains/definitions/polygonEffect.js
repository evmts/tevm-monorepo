import { polygon } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof polygon, Error>}
 */
export const polygonEffect = wrapInEffect(polygon);