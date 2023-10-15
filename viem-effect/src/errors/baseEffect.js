import { base } from "viem/chains";
import { wrapInEffect } from '../wrapInEffect.js';

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof base, import("viem/chains").BaseErrorType>}
 */
export const baseEffect = wrapInEffect(base);