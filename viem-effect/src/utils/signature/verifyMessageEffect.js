import { verifyMessage } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof verifyMessage, Error>}
 */
export const verifyMessageEffect = wrapInEffect(verifyMessage);