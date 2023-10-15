import { call } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof call, import("viem/actions").CallErrorType>}
 */
export const callEffect = wrapInEffect(call);