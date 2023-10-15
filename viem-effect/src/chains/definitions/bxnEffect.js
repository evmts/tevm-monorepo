import { bxn } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof bxn, Error>}
 */
export const bxnEffect = wrapInEffect(bxn);