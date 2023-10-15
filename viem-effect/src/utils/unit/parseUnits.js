import { parseUnits as viemParseUnits } from 'viem'
import { wrapViemSync } from './wrapViemSync.js'

/**
 * @type {import('./wrapViemSync.js').WrapedViemFunction<typeof viemParseUnits, import("viem/utils").ParseUnitsErrorType>}
 */
export const parseUnits = wrapViemSync(viemParseUnits)
