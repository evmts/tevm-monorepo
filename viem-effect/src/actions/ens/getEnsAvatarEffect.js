import { getEnsAvatar } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getEnsAvatar, import("viem/actions").GetEnsAvatarErrorType>}
 */
export const getEnsAvatarEffect = wrapInEffect(getEnsAvatar);