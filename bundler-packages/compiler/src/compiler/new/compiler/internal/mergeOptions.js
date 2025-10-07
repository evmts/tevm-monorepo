/**
 * Merge constructor options with overrides to get the solc options
 * @param {import('../CompileBaseOptions.js').CompileBaseOptions | undefined} options - Constructor options
 * @param {import('../CompileBaseOptions.js').CompileBaseOptions | undefined} overrides - Option overrides
 * @returns {import('../CompileBaseOptions.js').CompileBaseOptions} The merged compilation options
 */
export const mergeOptions = (options = {}, overrides = {}) => {
	return Object.assign(
		{
			// Compiler-specific options (not as per SolcSettings)
			language: overrides.language ?? options.language,
			solcVersion: overrides.solcVersion ?? options.solcVersion,
			throwOnVersionMismatch: overrides.throwOnVersionMismatch ?? options.throwOnVersionMismatch,
			throwOnCompilationError: overrides.throwOnCompilationError ?? options.throwOnCompilationError,
			cacheEnabled: overrides.cacheEnabled ?? options.cacheEnabled,
			loggingLevel: overrides.loggingLevel ?? options.loggingLevel,
			exposeInternalFunctions: overrides.exposeInternalFunctions ?? options.exposeInternalFunctions,
			exposeInternalVariables: overrides.exposeInternalVariables ?? options.exposeInternalVariables,
			// solc settings
			outputSelection: overrides.compilationOutput ?? options.compilationOutput,
			evmVersion: overrides.hardfork ?? options.hardfork,
		},
		overrides.cacheDirectory && { cacheDirectory: overrides.cacheDirectory },
		(overrides.optimizer || options.optimizer) && {
			optimizer: Object.assign(
				{},
				options.optimizer,
				overrides.optimizer,
				(overrides.optimizer?.details || options.optimizer?.details) && {
					details: Object.assign(
						{},
						options.optimizer?.details,
						overrides.optimizer?.details,
						(overrides.optimizer?.details?.yulDetails || options.optimizer?.details?.yulDetails) && {
							yulDetails: Object.assign(
								{},
								options.optimizer?.details?.yulDetails,
								overrides.optimizer?.details?.yulDetails,
							),
						},
					),
				},
			),
		},
		(overrides.viaIR !== undefined || options.viaIR !== undefined) && {
			viaIR: overrides.viaIR ?? options.viaIR,
		},
		(overrides.debug || options.debug) && {
			debug: Object.assign({}, options.debug, overrides.debug),
		},
		(overrides.metadata || options.metadata) && {
			metadata: Object.assign({}, options.metadata, overrides.metadata),
		},
		overrides.remappings && { remappings: overrides.remappings },
		overrides.libraries && { libraries: overrides.libraries },
		(overrides.modelChecker || options.modelChecker) && {
			modelChecker: Object.assign({}, options.modelChecker, overrides.modelChecker),
		},
	)
}
