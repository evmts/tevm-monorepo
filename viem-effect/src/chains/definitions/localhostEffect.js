import { localhost } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof localhost, Error>}
 */
export const localhostEffect = wrapInEffect(localhost);