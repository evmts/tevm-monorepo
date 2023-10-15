import { parseGwei as viemParseGwei } from 'viem'
import { wrapViemSync } from './wrapViemSync.js'

/**
 * @type {import('./wrapViemSync.js').WrapedViemFunction<typeof viemParseGwei, import("viem/utils").ParseGweiErrorType>}
 */
export const parseGwei = wrapViemSync(viemParseGwei)
