import { getEnsResolver } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getEnsResolver, import("viem/actions").GetEnsResolverErrorType>}
 */
export const getEnsResolverEffect = wrapInEffect(getEnsResolver);