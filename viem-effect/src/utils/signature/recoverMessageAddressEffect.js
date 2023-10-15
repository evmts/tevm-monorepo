import { recoverMessageAddress } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof recoverMessageAddress, Error>}
 */
export const recoverMessageAddressEffect = wrapInEffect(recoverMessageAddress);