import { Bloom } from '@tevm/utils'

/**
 * @internal
 * Creates a bloom filter from the logs.
 * @param {any[] | undefined} logs - The logs to create the bloom filter from.
 * @returns {Bloom}
 * @throws {never}
 */
export function txLogsBloom(logs) {
	const bloom = new Bloom()
	if (logs) {
		for (let i = 0; i < logs.length; i++) {
			const log = logs[i]
			// add the address
			bloom.add(log[0])
			// add the topics
			const topics = log[1]
			for (let q = 0; q < topics.length; q++) {
				bloom.add(topics[q])
			}
		}
	}
	return bloom
}
