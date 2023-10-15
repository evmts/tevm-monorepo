import { opBNB } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof opBNB, Error>}
 */
export const opBNBEffect = wrapInEffect(opBNB);