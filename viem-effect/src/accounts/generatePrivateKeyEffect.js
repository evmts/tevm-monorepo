import { generatePrivateKey } from "viem/accounts";
import { wrapInEffect } from '../wrapInEffect.js';

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof generatePrivateKey, Error>}
 */
export const generatePrivateKeyEffect = wrapInEffect(generatePrivateKey);