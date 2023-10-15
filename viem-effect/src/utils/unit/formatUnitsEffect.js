import { formatUnits } from 'viem'
import { wrapViemSync } from '../../wrapViemSync.js'

/**
 * @type {import('../../wrapViemSync.js').WrapedViemFunction<typeof formatUnits, import("viem/utils").FormatUnitsErrorType>}
 */
export const formatUnitsEffect = wrapViemSync(formatUnits)
