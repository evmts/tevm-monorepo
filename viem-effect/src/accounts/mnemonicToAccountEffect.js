import { mnemonicToAccount } from "viem/accounts";
import { wrapInEffect } from '../wrapInEffect.js';

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof mnemonicToAccount, import("viem/accounts").MnemonicToAccountErrorType>}
 */
export const mnemonicToAccountEffect = wrapInEffect(mnemonicToAccount);