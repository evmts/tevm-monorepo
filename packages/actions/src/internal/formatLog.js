/**
 * Formats a log object from internal representation to the JSON-RPC response format
 * @param {{
 *   address: import('@tevm/utils').Hex;
 *   topics: readonly import('@tevm/utils').Hex[];
 *   data: import('@tevm/utils').Hex;
 *   blockNumber?: bigint;
 *   transactionHash?: import('@tevm/utils').Hex;
 *   transactionIndex?: bigint;
 *   blockHash?: import('@tevm/utils').Hex;
 *   logIndex?: bigint;
 *   removed?: boolean;
 * }} log - The log object to format
 * @returns {import('../common/FilterLog.js').FilterLog} - The formatted log object
 */
export const formatLog = (log) => {
	return {
		address: log.address,
		topics: log.topics,
		data: log.data,
		blockNumber: log.blockNumber ?? 0n,
		transactionHash: log.transactionHash ?? '0x0000000000000000000000000000000000000000000000000000000000000000',
		transactionIndex: log.transactionIndex ?? 0n,
		blockHash: log.blockHash ?? '0x0000000000000000000000000000000000000000000000000000000000000000',
		logIndex: log.logIndex ?? 0n,
		removed: log.removed ?? false,
	}
}
