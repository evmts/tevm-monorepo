/**
 * @param {import('@tevm/node').TevmNode} client
 */
export const tevmLightSyncStatusProcedure = (client) => {
	/** @param {any} request */
	return (request) => {
		const status = client.getLightSyncStatus()
		return {
			jsonrpc: '2.0',
			method: request.method,
			...('id' in request ? { id: request.id } : {}),
			result: {
				...status,
				optimisticSlot: `0x${status.optimisticSlot.toString(16)}`,
				safeSlot: `0x${status.safeSlot.toString(16)}`,
				finalizedSlot: `0x${status.finalizedSlot.toString(16)}`,
			},
		}
	}
}
