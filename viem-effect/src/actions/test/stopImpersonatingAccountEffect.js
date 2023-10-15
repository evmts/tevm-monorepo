import { stopImpersonatingAccount } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof stopImpersonatingAccount, import("viem/actions").StopImpersonatingAccountErrorType>}
 */
export const stopImpersonatingAccountEffect = wrapInEffect(stopImpersonatingAccount);