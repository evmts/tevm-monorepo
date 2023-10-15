import { hdKeyToAccount } from "viem/accounts";
import { wrapInEffect } from '../wrapInEffect.js';

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof hdKeyToAccount, Error>}
 */
export const hdKeyToAccountEffect = wrapInEffect(hdKeyToAccount);