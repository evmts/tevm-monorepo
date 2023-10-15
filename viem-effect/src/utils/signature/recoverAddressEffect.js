import { recoverAddress } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof recoverAddress, Error>}
 */
export const recoverAddressEffect = wrapInEffect(recoverAddress);