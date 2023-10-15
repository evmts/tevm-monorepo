import { generateMnemonic } from "viem/accounts";
import { wrapInEffect } from '../wrapInEffect.js';

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof generateMnemonic, import("viem/accounts").GenerateMnemonicErrorType>}
 */
export const generateMnemonicEffect = wrapInEffect(generateMnemonic);