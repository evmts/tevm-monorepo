import { formatEther } from 'viem'
import { wrapViemSync } from '../../wrapViemSync.js'

/**
 * @type {import('../../wrapViemSync.js').WrapedViemFunction<typeof formatEther, import("viem/utils").FormatEtherErrorType>}
 */
export const formatEtherEffect = wrapViemSync(formatEther)

