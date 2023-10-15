import { fromRlp } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof fromRlp, import("viem/utils").FromRlpErrorType>}
 */
export const fromRlpEffect = wrapInEffect(fromRlp);