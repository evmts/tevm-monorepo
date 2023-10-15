import { toAccount } from "viem/accounts";
import { wrapInEffect } from '../wrapInEffect.js';

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof toAccount, Error>}
 */
export const toAccountEffect = wrapInEffect(toAccount);