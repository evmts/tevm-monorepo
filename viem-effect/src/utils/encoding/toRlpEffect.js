import { toRlp } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof toRlp, Error>}
 */
export const toRlpEffect = wrapInEffect(toRlp);