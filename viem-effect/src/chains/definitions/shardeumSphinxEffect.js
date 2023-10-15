import { shardeumSphinx } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof shardeumSphinx, Error>}
 */
export const shardeumSphinxEffect = wrapInEffect(shardeumSphinx);