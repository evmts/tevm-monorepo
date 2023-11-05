import { EVM } from "@ethereumjs/evm"
import { DefaultStateManager } from '@ethereumjs/statemanager'
import { EthersStateManager } from "./stateManager.js"
import { Chain, Common, Hardfork } from "@ethereumjs/common"
import { JsonRpcProvider } from "ethers"
import { executeScript, type ExecuteScriptParameters, type ExecuteScriptResult } from './actions/executeScript.js'
import type { Abi } from "abitype"
import { putAccount, type PutAccountParameters } from "./actions/putAccount.js"
import { putContractCode, type PutContractCodeParameters } from "./actions/putContractCode.js"
import { runCall, type RunCallParameters } from "./actions/runCall.js"

/**
 * Options fetch state that isn't available locally.
 */
type ForkOptions = {
	/**
	 * A viem PublicClient to use for the EVM.
	 * It will be used to fetch state that isn't available locally.
	 */
	url: string
	/**
	 * The block tag to use for the EVM.
	 * If not passed it will start from the latest
	 * block at the time of forking
	 */
	blockTag?: bigint
}

/**
 * Options for creating an EVMts instance
 */
export type CreateEVMOptions = {
	fork?: ForkOptions
}

/**
 * A local EVM instance running in JavaScript. Similar to Anvil in your browser
 * @example
 * ```ts
 * import { EVMts } from "evmts"
 * import { createPublicClient, http } from "viem"
 * import { MyERC20 } from './MyERC20.sol'
 * 
 * const evmts = EVMts.create({
 * 	fork: {
 * 	  url: "https://mainnet.optimism.io",
 * 	},
 * })
 *
 * const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
 
 * await evmts.executeContract(
 *   MyERC20.execute.mint({
 *     caller: address,
 *   }),
 * )
 */
export class EVMts {
	/**
	 * Creates a {@link EVMts} instance
	 */
	static readonly create = async (options: CreateEVMOptions = {}) => {
		let stateManager: DefaultStateManager | EthersStateManager
		let chainId: number
		const hardfork = Hardfork.Shanghai
		if (options.fork?.url) {
			const provider = new JsonRpcProvider(options.fork.url)
			const blockTag = options.fork.blockTag ?? BigInt(await provider.getBlockNumber())
			chainId = Number((await provider.getNetwork()).chainId)
			stateManager = new EthersStateManager({ provider, blockTag })
		} else {
			chainId = 1
			stateManager = new DefaultStateManager()
		}
		const common = new Common({ chain: chainId, hardfork })
		return new EVMts(stateManager, common)
	}

	/**
	 * A local EVM instance running in JavaScript. Similar to Anvil in your browser
	 */
	constructor(
		stateManager: DefaultStateManager | EthersStateManager,
		common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Shanghai }),
		public readonly evm = new EVM({
			common,
			stateManager,
			// blockchain, // Always running the EVM statelessly so not including blockchain
			allowUnlimitedContractSize: false,
			allowUnlimitedInitCodeSize: false,
			customOpcodes: [],
			customPrecompiles: [],
			profiler: {
				enabled: false,
			}
		})
	) { }

	public readonly executeScript = async <
		TAbi extends Abi | readonly unknown[] = Abi,
		TFunctionName extends string = string,
	>(parameters: ExecuteScriptParameters<TAbi, TFunctionName>): Promise<ExecuteScriptResult<TAbi, TFunctionName>> => {
		return executeScript(this, parameters)
	}

	public readonly putAccount = async (parameters: PutAccountParameters): Promise<void> => {
		return putAccount(this, parameters)
	}

	public readonly putContractCode = async (parameters: PutContractCodeParameters) => {
		return putContractCode(this, parameters)
	}

	public readonly runCall = async (
		parameters: RunCallParameters,
	) => {
		return runCall(this, parameters)
	}
}

