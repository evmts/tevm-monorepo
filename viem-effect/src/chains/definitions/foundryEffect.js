import { foundry } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof foundry, Error>}
 */
export const foundryEffect = wrapInEffect(foundry);