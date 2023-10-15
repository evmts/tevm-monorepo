import { edgeware } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof edgeware, Error>}
 */
export const edgewareEffect = wrapInEffect(edgeware);