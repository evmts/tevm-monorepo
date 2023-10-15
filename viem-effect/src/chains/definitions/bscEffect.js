import { bsc } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof bsc, Error>}
 */
export const bscEffect = wrapInEffect(bsc);