import { contractHandler } from '@tevm/actions'

// TODO we need to make this type generic wrt return type based on input
/**
 * A tree shakeable version of the tevmContract action for viem.
 * Interacts with a contract method call using TEVM.
 *
 * @param {import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>} client
 * @param {import('@tevm/actions').ContractParams} params
 * @returns {Promise<import('@tevm/actions').ContractResult>} The result of the contract method call.
 */
export const tevmContract = async (client, params) => {
	return contractHandler(client.transport.tevm)(params)
}
