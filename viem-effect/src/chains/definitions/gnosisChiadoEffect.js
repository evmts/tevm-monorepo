import { gnosisChiado } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof gnosisChiado, Error>}
 */
export const gnosisChiadoEffect = wrapInEffect(gnosisChiado);