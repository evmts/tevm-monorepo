import { prefetchStorageFromAccessList } from './prefetchStorageFromAccessList.js'

/**
 * Sets up a proxy around the fork transport to detect storage-related requests
 * and trigger prefetching after the first uncached request
 *
 * @internal
 * @param {import('@tevm/node').TevmNode} client
 * @param {Map<string, Set<string>> | undefined} accessList
 * @returns {Promise<void>}
 */
export const setupPrefetchProxy = async (client, accessList) => {
	if (!client.forkTransport || !accessList || accessList.size === 0) return

	let hasPrefetched = false

	// Store the original request function
	const originalRequest = client.forkTransport.request.bind(client.forkTransport)

	// Replace with proxy function
	client.forkTransport.request = async (request) => {
		// Check if this is a storage-related request
		if (!hasPrefetched && (request.method === 'eth_getStorageAt' || request.method === 'eth_getProof')) {
			client.logger.debug({ method: request.method }, 'First storage request detected, triggering prefetch')

			// Mark as prefetched to avoid doing it again
			hasPrefetched = true

			// Trigger prefetching in the background
			prefetchStorageFromAccessList(client, accessList).catch((error) => {
				client.logger.error({ error }, 'Error during storage prefetching after first storage request')
			})
		}

		// Forward the request to the original implementation
		return originalRequest(request)
	}
}
