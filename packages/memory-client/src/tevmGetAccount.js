import { getAccountHandler } from '@tevm/actions'

/**
 * A tree shakeable version of the tevmGetAccount action for viem.
 * Retrieves the account information from TEVM.
 *
 * @param {import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>} client
 * @param {import('@tevm/actions').GetAccountParams} params
 * @returns {Promise<import('@tevm/actions').GetAccountResult>} The account information.
 */
export const tevmGetAccount = async (client, params) => {
	return getAccountHandler(client.transport.tevm)(params)
}
