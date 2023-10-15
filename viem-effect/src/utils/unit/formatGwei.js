import { formatGwei as viemFormatGwei } from 'viem'
import { wrapViemSync } from './wrapViemSync.js'

/**
 * @type {import('./wrapViemSync.js').WrapedViemFunction<typeof viemFormatGwei, import("viem/utils").FormatGweiErrorType>}
 */
export const formatGwei = wrapViemSync(viemFormatGwei)
