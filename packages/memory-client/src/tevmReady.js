// TODO update @throws to TevmReadyError
/**
 * A tree shakeable version of the tevmReady action for viem.
 * Checks if TEVM is ready.
 *
 * @param {import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>} client
 * @returns {Promise<true>} Resolves when ready rejects if vm fails to initialize.
 * @throws {Error} If the vm fails to initialize.
 */
export const tevmReady = async (client) => {
	return client.transport.tevm.ready()
}
