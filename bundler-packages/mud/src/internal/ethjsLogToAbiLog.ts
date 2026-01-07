import { type Abi, bytesToHex, decodeEventLog, type EthjsLog, type Log } from '@tevm/utils'

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
			topics: topicsHex as any,
		}),
		address: addressHex,
		data: dataHex,
		topics: topicsHex as any,
		// Required fields for Log type (mock values for internal use)
		blockHash: null,
		blockNumber: null,
		logIndex: null,
		transactionHash: null,
		transactionIndex: null,
		removed: false,
	}
}
