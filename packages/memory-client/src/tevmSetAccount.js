import { setAccountHandler } from '@tevm/actions'

/**
 * A tree shakeable version of the tevmSetAccount action for viem.
 * Sets the account in TEVM.
 *
 * @param {import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>} client
 * @param {import('@tevm/actions').SetAccountParams} params
 * @returns {Promise<import('@tevm/actions').SetAccountResult>} The result of setting the account.
 */
export const tevmSetAccount = async (client, params) => {
	return setAccountHandler(client.transport.tevm)(params)
}
