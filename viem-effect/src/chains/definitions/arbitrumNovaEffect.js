import { arbitrumNova } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof arbitrumNova, Error>}
 */
export const arbitrumNovaEffect = wrapInEffect(arbitrumNova);