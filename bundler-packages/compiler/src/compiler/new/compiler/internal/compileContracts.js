import { solcCompile } from '@tevm/solc'
import { CompilerOutputError } from './errors.js'

/**
 * Compile Solidity or Yul code
 *
 * @template {import('@tevm/solc').SolcLanguage} TLanguage
 * @template {import('../CompilationOutputOption.js').CompilationOutputOption[]} TCompilationOutput
 * @param {{[sourcePath: string]: string}} sources - The source code to compile
 * @param {import('@tevm/solc').Solc} solc - Solc instance
 * @param {import('./ValidatedCompileBaseOptions.js').ValidatedCompileBaseOptions<TLanguage, TCompilationOutput>} options
 * @param {import('@tevm/logger').Logger} logger - The logger
 * @returns {import('./CompileContractsResult.js').CompileContractsResult<TCompilationOutput>}
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

		if (options.throwOnCompilationError) {
			throw new CompilerOutputError(`Compilation errors occurred`, {
				meta: {
					code: 'compilation_errors',
					errors: solcOutput.errors,
				},
			})
		}
	}

	// Process each source file
	Object.keys(sources).forEach((sourcePath) => {
		/** @type {import('./CompiledSource.js').CompiledSource<TCompilationOutput>} */
		const output = {}

		const solcAstOutput = solcOutput.sources[sourcePath]
		const solcContractOutput = solcOutput.contracts[sourcePath]

		if (options.compilationOutput.includes('ast') && solcAstOutput) {
			// @ts-expect-error - TODO: this will be fixed when we correctly type the compilation output from input selection
			output.ast = solcAstOutput.ast
			output.id = solcAstOutput.id
		}

		if (options.compilationOutput.filter((o) => o !== 'ast').length > 0 && solcContractOutput) {
			for (const [contractName, contractOutput] of Object.entries(solcContractOutput)) {
				output.contract[contractName] = contractOutput
			}
		}

		result.compilationResult[/** @type {keyof typeof result.compilationResult} */ (sourcePath)] = output
	})

	logger.debug(
		`Compiled ${Object.keys(result.compilationResult).length} sources with compilation result: ${JSON.stringify(result.compilationResult, null, 2)}`,
	)
	return result
}
