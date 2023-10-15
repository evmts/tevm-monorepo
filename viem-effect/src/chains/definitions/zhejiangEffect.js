import { zhejiang } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof zhejiang, Error>}
 */
export const zhejiangEffect = wrapInEffect(zhejiang);