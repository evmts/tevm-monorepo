import { formatUnits as viemFormatUnits } from 'viem'
import { wrapViemSync } from './wrapViemSync.js'

/**
 * @type {import('./wrapViemSync.js').WrapedViemFunction<typeof viemFormatUnits, import("viem/utils").FormatUnitsErrorType>}
 */
export const formatUnits = wrapViemSync(viemFormatUnits)
