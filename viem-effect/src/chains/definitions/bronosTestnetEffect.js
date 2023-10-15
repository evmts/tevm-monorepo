import { bronosTestnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof bronosTestnet, Error>}
 */
export const bronosTestnetEffect = wrapInEffect(bronosTestnet);