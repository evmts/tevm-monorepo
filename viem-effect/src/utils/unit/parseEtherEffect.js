import { parseEther } from 'viem'
import { wrapViemSync } from '../../wrapViemSync.js'

/**
 * @type {import('../../wrapViemSync.js').WrapedViemFunction<typeof parseEther, import("viem/utils").ParseEtherErrorType>}
 */
export const parseEtherEffect = wrapViemSync(parseEther)
