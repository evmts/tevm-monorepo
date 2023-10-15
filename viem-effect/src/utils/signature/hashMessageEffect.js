import { hashMessage } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof hashMessage, import("viem/utils").HashMessageErrorType>}
 */
export const hashMessageEffect = wrapInEffect(hashMessage);