import { wrapInEffect } from '../../wrapInEffect.js'
import { formatUnits } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof formatUnits, import("viem/utils").FormatUnitsErrorType>}
 */
export const formatUnitsEffect = wrapInEffect(formatUnits)
