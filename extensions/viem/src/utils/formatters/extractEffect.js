import { wrapInEffect } from '../../wrapInEffect.js'
import { extract } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof extract, import("viem/utils").ExtractErrorType>}
 */
export const extractEffect = wrapInEffect(extract)
