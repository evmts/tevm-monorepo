import { celo } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof celo, Error>}
 */
export const celoEffect = wrapInEffect(celo);