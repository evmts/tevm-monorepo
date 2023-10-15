import { parseEther as viemParseEther } from 'viem'
import { wrapViemSync } from './wrapViemSync.js'

/**
 * @type {import('./wrapViemSync.js').WrapedViemFunction<typeof viemParseEther, import("viem/utils").ParseEtherErrorType>}
 */
export const parseEther = wrapViemSync(viemParseEther)
