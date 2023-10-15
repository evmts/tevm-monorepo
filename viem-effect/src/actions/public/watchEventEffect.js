import { watchEvent } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof watchEvent, import("viem/actions").WatchEventErrorType>}
 */
export const watchEventEffect = wrapInEffect(watchEvent);