import { solcCompile } from '@tevm/solc'
import { CompilerOutputError } from './errors.js'

/**
 * Compile Solidity or Yul code
 *
 * @param {{[sourcePath: string]: string}} sources - The source code to compile
 * @param {import('@tevm/solc').Solc} solc - Solc instance
 * @param {import('./ValidatedCompileBaseOptions.js').ValidatedCompileBaseOptions} options
 * @param {import('@tevm/logger').Logger} logger - The logger
 * @returns {import('./CompileContractsResult.js').CompileContractsResult}
 * @throws {CompilerOutputError} If the source or contract output is not found in the solc output
 */
export const compileContracts = (sources, solc, options, logger) => {
	/** @type {import('@tevm/solc').SolcSettings} */
	const settings = Object.assign(
		{
			evmVersion: options.hardfork,
			outputSelection: {
				'*': {
					'': ['ast'],
					'*': options.compilationOutput,
				},
			},
		},
		options.optimizer && { optimizer: options.optimizer },
		options.viaIR !== undefined && { viaIR: options.viaIR },
		options.debug && { debug: options.debug },
		options.metadata && { metadata: options.metadata },
		options.remappings && { remappings: options.remappings },
		options.libraries && { libraries: options.libraries },
		options.modelChecker && { modelChecker: options.modelChecker },
	)

	/** @type {import('@tevm/solc').SolcInputDescription} */
	const solcInput = {
		language: options.language,
		sources: Object.fromEntries(
			Object.entries(sources).map(([sourcePath, sourceCode]) => [sourcePath, { content: sourceCode }]),
		),
		settings,
	}

	logger.debug(
		`Compiling ${Object.keys(sources).length} sources with solc input: ${JSON.stringify(solcInput, null, 2)}`,
	)
	const solcOutput = solcCompile(solc, solcInput)
	/** @type {import('./CompileContractsResult.js').CompileContractsResult} */
	const result = { compilationResult: {} }

	if (solcOutput.errors) {
		result.errors = solcOutput.errors
		solcOutput.errors.forEach((error, i) => {
			if (error.severity === 'error') {
				logger.error(`[${i}] Compilation error: ${error.message}`)
			} else if (error.severity === 'warning') {
				logger.warn(`[${i}] Compilation warning: ${error.message}`)
			} else {
				logger.debug(`[${i}] Compilation info: ${error.message}`)
			}
		})
	}

	// Process each source file
	Object.keys(sources).forEach((sourcePath) => {
		/** @type {import('./CompiledSource.js').CompiledSource} */
		const output = { ast: undefined, id: 0, contract: {} }

		const solcAstOutput = solcOutput.sources[sourcePath]
		const solcContractOutput = solcOutput.contracts[sourcePath]

		if (options.compilationOutput.includes('ast')) {
			if (!solcAstOutput) {
				const err = new CompilerOutputError(`Source output not found for ${sourcePath}`, {
					meta: {
						code: 'source_output_not_found',
						sourcePath,
						availableSources: Object.keys(solcOutput.sources),
					},
				})
				logger.error(err.message)
				throw err
			}
			output.ast = solcAstOutput
			output.id = solcAstOutput.id
		}

		// If anything else that the ast is requested and we don't have contract output, this is a problem
		if (options.compilationOutput.filter((o) => o !== 'ast').length === 0) return

		if (!solcContractOutput) {
			const err = new CompilerOutputError(`Contract output not found for ${sourcePath}`, {
				meta: {
					code: 'contract_output_not_found',
					sourcePath,
					availableSources: Object.keys(solcOutput.contracts),
				},
			})
			logger.error(err.message)
			throw err
		}

		for (const [contractName, contractOutput] of Object.entries(solcContractOutput)) {
			output.contract[contractName] = contractOutput
		}

		result.compilationResult[/** @type {keyof typeof result.compilationResult} */ (sourcePath)] = output
	})

	logger.debug(
		`Compiled ${Object.keys(result.compilationResult).length} sources with compilation result: ${JSON.stringify(result.compilationResult, null, 2)}`,
	)
	return result
}
