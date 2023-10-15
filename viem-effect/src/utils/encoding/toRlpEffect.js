import { toRlp } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof toRlp, import("viem/utils").ToRlpErrorType>}
 */
export const toRlpEffect = wrapInEffect(toRlp);