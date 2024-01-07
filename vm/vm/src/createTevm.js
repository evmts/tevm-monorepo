import { Common, Hardfork } from '@ethereumjs/common'
import { DefaultStateManager } from '@ethereumjs/statemanager'
import {
	accountHandler,
	callHandler,
	contractHandler,
	requestProcedure,
	scriptHandler,
} from '@tevm/procedures'
import { createHttpHandler as _createHttpHandler } from '@tevm/server'
import { TevmStateManager } from '@tevm/state'
import { http, createPublicClient } from 'viem'

/**
 * A local EVM instance running in JavaScript. Similar to Anvil in your browser
 * @param {import('./CreateEVMOptions.js').CreateEVMOptions} [options]
 * @returns {Promise<import('./Tevm.js').Tevm>}
 * @example
 * ```ts
 * import { Tevm } from "tevm"
 * import { createPublicClient, http } from "viem"
 * import { MyERC721 } from './MyERC721.sol'
 *
 * const tevm = Tevm.create({
 * 	fork: {
 * 	  url: "https://mainnet.optimism.io",
 * 	},
 * })
 *
 * const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',

 * await tevm.runContractCall(
 *   MyERC721.write.mint({
 *     caller: address,
 *   }),
 * )
 *
 * const balance = await tevm.runContractCall(
 *  MyERC721.read.balanceOf({
 *  caller: address,
 *  }),
 *  )
 *  console.log(balance) // 1n
 *  ```
 */
export const createTevm = async (options = {}) => {
	/**
	 * @type {DefaultStateManager | TevmStateManager}
	 */
	let stateManager
	// ethereumjs throws an error for most chain ids
	if (options.fork?.url) {
		const client = createPublicClient({
			transport: http(options.fork.url),
		})
		const blockTag = options.fork.blockTag ?? (await client.getBlockNumber())
		stateManager = new TevmStateManager({ client, blockTag })
	} else {
		stateManager = new TevmStateManager()
	}

	const evm = new TevmEvm({
		common: new Common({ chain: 1, hardfork: Hardfork.Shanghai }),
		stateManager,
		// blockchain, // Always running the EVM statelessly so not including blockchain
		allowUnlimitedContractSize: options.allowUnlimitedContractSize ?? false,
		allowUnlimitedInitCodeSize: false,
		customOpcodes: [],
		// TODO uncomment the mapping once we make the api correct
		customPrecompiles: options.customPrecompiles ?? [], // : customPrecompiles.map(p => ({ ...p, address: new EthjsAddress(hexToBytes(p.address)) })),
		profiler: {
			enabled: false,
		},
	})

	/**
	 * @type {import('./Tevm.js').Tevm}
	 */
	const tevm = {
		_evm: evm,
		request: requestProcedure(evm),
		script: scriptHandler(evm),
		account: accountHandler(evm),
		call: callHandler(evm),
		contract: contractHandler(evm),
		createHttpHandler: () => {
			if (tevm.forkUrl) {
				return _createHttpHandler({ evm: tevm._evm, proxyUrl: tevm.forkUrl })
			} else {
				return _createHttpHandler({ evm: tevm._evm })
			}
		},
		...(options.fork?.url
			? { forkUrl: options.fork.url }
			: { forkUrl: options.fork?.url }),
	}

	await Promise.all(
		options.customPredeploys?.map((predeploy) => {
			tevm.account({
				address: predeploy.address,
				deployedBytecode: predeploy.contract.deployedBytecode,
			})
		}) || [],
	)

	return tevm
}
