import { moonbeamDev } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof moonbeamDev, Error>}
 */
export const moonbeamDevEffect = wrapInEffect(moonbeamDev);