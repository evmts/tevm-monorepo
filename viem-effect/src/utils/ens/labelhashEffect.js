import { labelhash } from "viem/ens";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof labelhash, import("viem/ens").LabelhashErrorType>}
 */
export const labelhashEffect = wrapInEffect(labelhash);