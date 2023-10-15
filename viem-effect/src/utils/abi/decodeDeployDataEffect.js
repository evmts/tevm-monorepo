import { decodeDeployData } from "viem";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof decodeDeployData, Error>}
 */
export const decodeDeployDataEffect = wrapInEffect(decodeDeployData);