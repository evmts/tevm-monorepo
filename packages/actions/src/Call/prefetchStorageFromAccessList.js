import { createAddress } from "@tevm/address";
import { hexToBytes } from "viem";

/**
 * Prefetches storage slots from an access list to warm up the cache
 *
 * @internal
 * @param {import('@tevm/node').TevmNode} client
 * @param {import("../eth/EthJsonRpcResponse.js").EthCreateAccessListJsonRpcResponse['result']} accessList
 * @returns {Promise<void>}
 */
export const prefetchStorageFromAccessList = async (client, accessList) => {
	const vm = await client.getVm();
	const promises = [];

	// Loop through each address in the access list
	for (const item of accessList?.accessList ?? []) {
		const address = createAddress(item.address);

		// Loop through each storage slot for this address
		for (const slot of item.storageKeys) {
			// Prefetch the storage slot to warm the cache
			promises.push(
				vm.stateManager.getContractStorage(address, hexToBytes(slot))
					.catch(error => {
						client.logger.debug(
							{ error, address: item.address, slot },
							"Error prefetching storage slot"
						);
					})
			);
		}
	}

	// Wait for all prefetch operations to complete
	await Promise.all(promises);

	client.logger.debug(
		{
			addressCount: accessList?.accessList.length,
			slotCount: accessList?.accessList.reduce((count, item) => count + item.storageKeys.length, 0)
		},
		"Completed prefetching storage slots"
	);
};
