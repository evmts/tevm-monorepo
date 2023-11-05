import { EVM } from "@ethereumjs/evm"
import { createCommon } from "./common.js"
import { createStateManager } from "./stateManager.js"
import { type PublicClient } from "viem"

export type CreatEVMOptions = {
	/**
	 * A viem PublicClient to use for the EVM.
	 * It will be used to fetch state that isn't available locally.
	 */
	publicClient: PublicClient
	/**
	 * The block tag to use for the EVM.
	 */
	blockTag: bigint
}

export const createEVM = ({ publicClient, blockTag }: CreatEVMOptions) => {
	// currently hardcoded to shanghai
	const common = createCommon()
	// Hacking this into working with the correct url until state manager is migrated to viem
	const stateManager = createStateManager({ rpcUrl: publicClient.chain!.rpcUrls.default.http[0] as string, blockTag })
	return new EVM({
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
}

