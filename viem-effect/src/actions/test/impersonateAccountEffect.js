import { impersonateAccount } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof impersonateAccount, import("viem/actions").ImpersonateAccountErrorType>}
 */
export const impersonateAccountEffect = wrapInEffect(impersonateAccount);