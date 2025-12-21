import { type Abi, bytesToHex, decodeEventLog, type EthjsLog } from '@tevm/utils'
import type { Log } from 'viem'

/**
 * Converts ethjs log format back to structured log arguments
 */
export const ethjsLogToAbiLog = <TAbi extends Abi>(abi: TAbi, ethjsLog: EthjsLog): Log => {
	const [addressBytes, topicsBytes, dataBytes] = ethjsLog

	const addressHex = bytesToHex(addressBytes)
	const topicsHex = topicsBytes.map((topic) => bytesToHex(topic))
	const dataHex = bytesToHex(dataBytes)

	return {
		...decodeEventLog({
			abi,
			data: dataHex,
			// @ts-expect-error - Source provides no match for required element at position 0 in target.
			topics: topicsHex,
		}),
		address: addressHex,
		data: dataHex,
		// @ts-expect-error - Source provides no match for required element at position 0 in target.
		topics: topicsHex,
	}
}
