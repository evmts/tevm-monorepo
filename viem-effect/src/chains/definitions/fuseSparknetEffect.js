import { fuseSparknet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof fuseSparknet, Error>}
 */
export const fuseSparknetEffect = wrapInEffect(fuseSparknet);