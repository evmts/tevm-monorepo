import { rpc } from "viem/utils";
import { wrapInEffect } from '../wrapInEffect.js';

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof rpc, Error>}
 */
export const rpcEffect = wrapInEffect(rpc);