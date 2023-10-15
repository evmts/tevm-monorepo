import { encodePacked } from "viem/abi";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof encodePacked, Error>}
 */
export const encodePackedEffect = wrapInEffect(encodePacked);