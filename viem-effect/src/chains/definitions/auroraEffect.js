import { aurora } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof aurora, Error>}
 */
export const auroraEffect = wrapInEffect(aurora);