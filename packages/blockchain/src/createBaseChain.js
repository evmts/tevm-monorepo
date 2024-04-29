/**
 * @param {import('./ChainOptions.js').ChainOptions} options
 * @returns {import('./BaseChain.js').BaseChain} Base chain object
 */
export const createBaseChain = (options) => {
	// const stateRoot = genesisStateRoot(genesisState)
	return {
		options,
		common: options.common,
		blocks: new Map(),
		blocksByTag: new Map(),
		blocksByNumber: new Map(),
	}
}
