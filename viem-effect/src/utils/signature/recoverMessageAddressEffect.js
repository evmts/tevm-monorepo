import { recoverMessageAddress } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof recoverMessageAddress, import("viem/utils").RecoverMessageAddressErrorType>}
 */
export const recoverMessageAddressEffect = wrapInEffect(recoverMessageAddress);