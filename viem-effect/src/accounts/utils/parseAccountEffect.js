import { parseAccount } from "viem/accounts";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof parseAccount, Error>}
 */
export const parseAccountEffect = wrapInEffect(parseAccount);