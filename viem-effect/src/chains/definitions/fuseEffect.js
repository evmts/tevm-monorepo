import { fuse } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof fuse, Error>}
 */
export const fuseEffect = wrapInEffect(fuse);