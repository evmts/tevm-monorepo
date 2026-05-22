import { deployHandler } from '@tevm/actions'

/**
 * Tree-shakeable `tevmDeploy` action. Deploys a contract to the in-memory blockchain.
 *
 * The deployment runs immediately, but the contract is only added to canonical state once mined.
 * In manual mining mode (the default) call `client.mine()` after deploying.
 *
 * @param {import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>} client - The viem client configured with TEVM transport.
 * @param {import('@tevm/actions').DeployParams & import('@tevm/actions').CallEvents} params - Parameters for the contract deployment, including ABI, bytecode, and constructor arguments.
 * @returns {Promise<import('@tevm/actions').DeployResult>} Deployment result including created contract address and execution details.
 *
 * @example
 * ```typescript
 * import { tevmDeploy } from 'tevm/actions'
 * import { createClient, http, parseAbi } from 'viem'
 * import { createTevmTransport } from 'tevm'
 *
 * const client = createClient({ transport: createTevmTransport() })
 * const result = await tevmDeploy(client, {
 *   abi: parseAbi(['constructor(string)']),
 *   bytecode: '0x6080...',
 *   args: ['Token'],
 * })
 * await client.mine()
 * ```
 *
 * @see [DeployParams](https://tevm.sh/reference/tevm/actions/type-aliases/deployparams/) for options reference.
 * @see [DeployResult](https://tevm.sh/reference/tevm/actions/type-aliases/deployresult/) for return values reference.
 *
 * @throws Will throw if the contract deployment fails (constructor revert, invalid bytecode, insufficient gas).
 */
export const tevmDeploy = async (client, params) => {
	return deployHandler(client.transport.tevm)(params)
}
