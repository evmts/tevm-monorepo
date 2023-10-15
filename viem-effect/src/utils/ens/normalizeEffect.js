import { normalize } from "viem/ens";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof normalize, import("viem/ens").NormalizeErrorType>}
 */
export const normalizeEffect = wrapInEffect(normalize);