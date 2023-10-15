import { filecoinHyperspace } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof filecoinHyperspace, Error>}
 */
export const filecoinHyperspaceEffect = wrapInEffect(filecoinHyperspace);