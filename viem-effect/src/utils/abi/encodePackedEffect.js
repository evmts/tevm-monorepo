import { encodePacked } from "viem/abi";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof encodePacked, import("viem/abi").EncodePackedErrorType>}
 */
export const encodePackedEffect = wrapInEffect(encodePacked);