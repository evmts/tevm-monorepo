import { parseGwei } from 'viem'
import { wrapViemSync } from '../../wrapViemSync.js'

/**
 * @type {import('../../wrapViemSync.js').WrapedViemFunction<typeof parseGwei, import("viem/utils").ParseGweiErrorType>}
 */
export const parseGweiEffect = wrapViemSync(parseGwei)
