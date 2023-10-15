import { crossbell } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof crossbell, Error>}
 */
export const crossbellEffect = wrapInEffect(crossbell);