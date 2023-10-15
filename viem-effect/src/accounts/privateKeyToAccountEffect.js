import { privateKeyToAccount } from "viem/accounts";
import { wrapInEffect } from '../wrapInEffect.js';

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof privateKeyToAccount, import("viem/accounts").PrivateKeyToAccountErrorType>}
 */
export const privateKeyToAccountEffect = wrapInEffect(privateKeyToAccount);