import { parseUnits } from 'viem'
import { wrapViemSync } from '../../wrapViemSync.js'

/**
 * @type {import('../../wrapViemSync.js').WrapedViemFunction<typeof parseUnits, import("viem/utils").ParseUnitsErrorType>}
 */
export const parseUnitsEffect = wrapViemSync(parseUnits)
