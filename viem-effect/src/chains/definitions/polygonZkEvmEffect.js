import { polygonZkEvm } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof polygonZkEvm, Error>}
 */
export const polygonZkEvmEffect = wrapInEffect(polygonZkEvm);