import { encodeDeployData } from "viem/contract";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof encodeDeployData, Error>}
 */
export const encodeDeployDataEffect = wrapInEffect(encodeDeployData);