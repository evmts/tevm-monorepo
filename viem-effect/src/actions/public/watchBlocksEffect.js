import { watchBlocks } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof watchBlocks, import("viem/actions").WatchBlocksErrorType>}
 */
export const watchBlocksEffect = wrapInEffect(watchBlocks);