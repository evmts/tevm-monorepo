import { encodeEventTopics } from "viem/contract";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof encodeEventTopics, import("viem/contract").EncodeEventTopicsErrorType>}
 */
export const encodeEventTopicsEffect = wrapInEffect(encodeEventTopics);