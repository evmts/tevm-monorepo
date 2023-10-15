import { generateMnemonic } from "viem/accounts";
import { wrapInEffect } from '../wrapInEffect.js';

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof generateMnemonic, Error>}
 */
export const generateMnemonicEffect = wrapInEffect(generateMnemonic);