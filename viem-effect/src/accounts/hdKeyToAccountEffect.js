import { hdKeyToAccount } from "viem/accounts";
import { wrapInEffect } from '../wrapInEffect.js';

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof hdKeyToAccount, never>}
 */
export const hdKeyToAccountEffect = wrapInEffect(hdKeyToAccount);