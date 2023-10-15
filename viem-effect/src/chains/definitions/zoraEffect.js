import { zora } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof zora, Error>}
 */
export const zoraEffect = wrapInEffect(zora);