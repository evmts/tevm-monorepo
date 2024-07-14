import { mineHandler } from '../Mine/mineHandler.js'

/**
 * @param {import("@tevm/base-client").BaseClient} client
 * @returns {Promise<import("@tevm/base-client").BaseClient>}
 */
export const getPendingClient = async (client) => {
	// TODO we can do this using fork way more efficiently
	const clonedClient = await client.deepCopy()
	const txPool = await clonedClient.getTxPool()
	while (txPool.txsInPool > 0) {
		await mineHandler(clonedClient)()
	}
	return clonedClient
}
