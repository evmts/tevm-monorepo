import type { CustomPrecompile } from './CustomPrecompile.js'
import type { ForkOptions } from './ForkOptions.js'
import type { CustomPredeploy } from '@tevm/predeploys'

/**
 * Options for creating an Tevm instance
 */
export type CreateEVMOptions = {
	fork?: ForkOptions
	customPrecompiles?: CustomPrecompile[]
	customPredeploys?: CustomPredeploy[]
	allowUnlimitedContractSize?: boolean
}
