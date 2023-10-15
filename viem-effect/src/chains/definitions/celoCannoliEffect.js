import { celoCannoli } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof celoCannoli, Error>}
 */
export const celoCannoliEffect = wrapInEffect(celoCannoli);