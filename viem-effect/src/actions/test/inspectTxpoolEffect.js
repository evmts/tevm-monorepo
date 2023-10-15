import { inspectTxpool } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof inspectTxpool, import("viem/actions").InspectTxpoolErrorType>}
 */
export const inspectTxpoolEffect = wrapInEffect(inspectTxpool);