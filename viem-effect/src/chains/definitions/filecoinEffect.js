import { filecoin } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof filecoin, Error>}
 */
export const filecoinEffect = wrapInEffect(filecoin);