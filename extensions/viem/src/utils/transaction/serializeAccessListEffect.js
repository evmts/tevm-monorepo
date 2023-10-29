import { wrapInEffect } from '../../wrapInEffect.js'
import { serializeAccessList } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof serializeAccessList, import("viem/utils").SerializeAccessListErrorType>}
 */
export const serializeAccessListEffect = wrapInEffect(serializeAccessList)
