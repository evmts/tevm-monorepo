import { formatEther as viemFormatEther } from 'viem'
import { wrapViemSync } from './wrapViemSync.js'

/**
 * @type {import('./wrapViemSync.js').WrapedViemFunction<typeof viemFormatEther, import("viem/utils").FormatEtherErrorType>}
 */
export const formatEther = wrapViemSync(viemFormatEther)

