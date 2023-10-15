import { meter } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof meter, Error>}
 */
export const meterEffect = wrapInEffect(meter);