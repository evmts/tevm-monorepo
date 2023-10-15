import { formatGwei } from 'viem'
import { wrapViemSync } from '../../wrapViemSync.js'

/**
 * @type {import('../../wrapViemSync.js').WrapedViemFunction<typeof formatGwei, import("viem/utils").FormatGweiErrorType>}
 */
export const formatGweiEffect = wrapViemSync(formatGwei)
