import { wrapInEffect } from '../../wrapInEffect.js'
import { parseUnits } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof parseUnits, import("viem/utils").ParseUnitsErrorType>}
 */
export const parseUnitsEffect = wrapInEffect(parseUnits)
