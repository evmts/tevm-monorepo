import { createAddress } from '@tevm/address'
import { hexToBytes } from 'viem'

/**
 * Prefetches storage for all storage slots in the access list
 * Only triggered after the first storage request to the fork transport
 *
 * @internal
 * @param {import('@tevm/node').TevmNode} client
 * @param {Map<string, Set<string>> | undefined} accessList
 * @returns {Promise<void>}
 */
export const prefetchStorageFromAccessList = async (client, accessList) => {
	if (!accessList || accessList.size === 0) return

	const vm = await client.getVm()
	const stateManager = vm.stateManager

	// Prefetch all storage slots in parallel
	const prefetchPromises = []

	for (const [address, storageKeys] of accessList.entries()) {
		if (storageKeys.size === 0) continue

		// Create address object once per address
		const addressObj = createAddress(address.startsWith('0x') ? address : `0x${address}`)

		for (const storageKey of storageKeys) {
			// Convert storage key to bytes with proper padding to 32 bytes
			const hexKey = /** @type {`0x${string}`} */ (storageKey.startsWith('0x') ? storageKey : `0x${storageKey}`)
			const keyBytes = hexToBytes(hexKey, { size: 32 })

			// Queue up storage fetch
			prefetchPromises.push(
				stateManager.getContractStorage(addressObj, keyBytes).catch((error) => {
					client.logger.debug(
						{
							error,
							address: address.startsWith('0x') ? address : `0x${address}`,
							storageKey: storageKey.startsWith('0x') ? storageKey : `0x${storageKey}`,
						},
						'Error prefetching storage slot from access list',
					)
				}),
			)
		}
	}

	// Wait for all prefetch operations to complete
	await Promise.all(prefetchPromises)

	client.logger.debug(
		{ accessListSize: accessList.size, totalStorageSlotsPreloaded: prefetchPromises.length },
		'Prefetched storage slots from access list',
	)
}
