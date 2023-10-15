import { setLoggingEnabled } from "viem/test";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof setLoggingEnabled, import("viem/test").SetLoggingEnabledErrorType>}
 */
export const setLoggingEnabledEffect = wrapInEffect(setLoggingEnabled);