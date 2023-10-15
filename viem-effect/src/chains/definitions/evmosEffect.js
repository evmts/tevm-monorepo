import { evmos } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof evmos, Error>}
 */
export const evmosEffect = wrapInEffect(evmos);