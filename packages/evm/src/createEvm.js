import { Evm } from './Evm.js'

/**
 * @param {import('./CreateEvmOptions.js').CreateEvmOptions} options
 * @returns {Promise<import('./Evm.js').Evm>}
 */
export const createEvm = ({
	common,
	stateManager,
	blockchain,
	customPrecompiles,
	profiler,
	allowUnlimitedContractSize,
}) => {
	return Evm.create({
		common,
		stateManager,
		blockchain,
		allowUnlimitedContractSize: allowUnlimitedContractSize ?? false,
		allowUnlimitedInitCodeSize: false,
		customOpcodes: [],
		// TODO uncomment the mapping once we make the api correct
		customPrecompiles: customPrecompiles ?? [],
		profiler: {
			enabled: profiler ?? false,
		},
	})
}
