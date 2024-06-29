import { deployHandler } from '@tevm/actions'

/**
 * A tree shakeable version of the tevmDeploy action for viem.
 * Deploys a contract using TEVM.
 *
 * @param {import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>} client
 * @param {import('@tevm/actions').DeployParams} params
 * @returns {Promise<import('@tevm/actions').DeployResult>} The result of the contract deployment.
 */
export const tevmDeploy = async (client, params) => {
	return deployHandler(client.transport.tevm)(params)
}
