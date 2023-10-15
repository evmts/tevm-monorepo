import { recoverTypedDataAddress } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof recoverTypedDataAddress, import("viem/utils").RecoverTypedDataAddressErrorType>}
 */
export const recoverTypedDataAddressEffect = wrapInEffect(recoverTypedDataAddress);