import { confluxESpace } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof confluxESpace, Error>}
 */
export const confluxESpaceEffect = wrapInEffect(confluxESpace);