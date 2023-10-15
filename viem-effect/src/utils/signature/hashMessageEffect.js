import { hashMessage } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof hashMessage, Error>}
 */
export const hashMessageEffect = wrapInEffect(hashMessage);