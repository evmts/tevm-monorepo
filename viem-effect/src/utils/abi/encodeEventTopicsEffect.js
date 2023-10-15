import { encodeEventTopics } from "viem/contract";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * I manually updated this
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof encodeEventTopics, import("viem/contract").EncodeErrorResultErrorType>}
 */
export const encodeEventTopicsEffect = wrapInEffect(encodeEventTopics);
