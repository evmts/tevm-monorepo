import { prefetchStorageFromAccessList } from './prefetchStorageFromAccessList.js'

/**
 * Prefetches storage touched by an access list without wrapping the shared fork transport.
 *
 * @internal
 * @param {import('@tevm/node').TevmNode} client
 * @param {Map<string, Set<string>> | undefined} accessList
 * @returns {Promise<void>}
 */
export const setupPrefetchProxy = async (client, accessList) => {
	if (!client.forkTransport || !accessList || accessList.size === 0) return

	try {
		await prefetchStorageFromAccessList(client, accessList)
	} catch (error) {
		client.logger.error({ error }, 'Error during storage prefetching from access list')
	}
}
