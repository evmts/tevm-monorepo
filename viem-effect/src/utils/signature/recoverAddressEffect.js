import { recoverAddress } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof recoverAddress, import("viem/utils").RecoverAddressErrorType>}
 */
export const recoverAddressEffect = wrapInEffect(recoverAddress);