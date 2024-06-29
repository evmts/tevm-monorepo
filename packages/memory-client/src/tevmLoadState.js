import { loadStateHandler } from '@tevm/actions'

/**
 * A tree shakeable version of the tevmLoadState action for viem.
 * Loads the state into TEVM.
 *
 * @param {import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>} client
 * @param {import('@tevm/actions').LoadStateParams} params The state to load into TEVM.
 * @returns {Promise<import('@tevm/actions').LoadStateResult>} The result of loading the state.
 */
export const tevmLoadState = async (client, params) => {
	return loadStateHandler(client.transport.tevm)(params)
}
