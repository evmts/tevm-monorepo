import { rpc } from "viem/utils";
import { wrapInEffect } from '../wrapInEffect.js';

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof rpc, import("viem/utils").RpcErrorType>}
 */
export const rpcEffect = wrapInEffect(rpc);