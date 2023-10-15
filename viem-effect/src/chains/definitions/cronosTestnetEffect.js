import { cronosTestnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof cronosTestnet, Error>}
 */
export const cronosTestnetEffect = wrapInEffect(cronosTestnet);