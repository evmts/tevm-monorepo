import { moonbeam } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof moonbeam, Error>}
 */
export const moonbeamEffect = wrapInEffect(moonbeam);