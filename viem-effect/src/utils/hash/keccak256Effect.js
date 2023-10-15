import { keccak256 } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof keccak256, Error>}
 */
export const keccak256Effect = wrapInEffect(keccak256);