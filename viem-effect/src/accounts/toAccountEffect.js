import { toAccount } from "viem/accounts";
import { wrapInEffect } from '../wrapInEffect.js';

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof toAccount, import("viem/accounts").ToAccountErrorType>}
 */
export const toAccountEffect = wrapInEffect(toAccount);