import { gnosis } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof gnosis, Error>}
 */
export const gnosisEffect = wrapInEffect(gnosis);