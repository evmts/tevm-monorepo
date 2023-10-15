import { namehash } from "viem/ens";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof namehash, import("viem/ens").NamehashErrorType>}
 */
export const namehashEffect = wrapInEffect(namehash);