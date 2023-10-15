import { recoverTypedDataAddress } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof recoverTypedDataAddress, Error>}
 */
export const recoverTypedDataAddressEffect = wrapInEffect(recoverTypedDataAddress);