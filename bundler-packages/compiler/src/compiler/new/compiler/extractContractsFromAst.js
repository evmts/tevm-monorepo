import { createLogger } from '@tevm/logger'
import { ASTReader, ASTWriter, DefaultASTWriterMapping, PrettyFormatter } from 'solc-typed-ast'
import { defaults } from './internal/defaults.js'
import { AstParseError } from './internal/errors.js'

/**
 * Convert AST to Solidity source code
 *
 * This function handles both raw Solidity compiler AST output (i.e. likely solc output)
 * and pre-parsed universal AST nodes (i.e. likely solc-typed-ast output).
 *
 * Solc AST output will be parsed into universal AST format using ASTReader. Note that the format changed
 * in 0.8.0, which the ASTReader will figure out and handle correctly.
 *
 * @param {import('solc-typed-ast').ASTNode | import('@tevm/solc').SolcAst} source - The AST source unit to convert
 * @param {import('./internal/ValidatedCompileBaseOptions.js').ValidatedCompileBaseOptions} options
 * @returns {import('./ExtractContractsFromAstResult.js').ExtractContractsFromAstResult} Mapping of source path to Solidity source code
 */
export const extractContractsFromAst = (source, options) => {
	const logger = createLogger({ name: '@tevm/compiler', level: options?.loggingLevel ?? defaults.loggingLevel })
	const formatter = new PrettyFormatter(4, 0)
	const writer = new ASTWriter(DefaultASTWriterMapping, formatter, options.solcVersion)
	logger.debug(`Converting AST node to Solidity source code with solc version: ${options.solcVersion}`)

	// If the AST is already an universal AST tree, we don't need to parse it (it probably comes from solc-typed-ast)
	// Otherwise it comes from the solc compilation output and we need to parse the json
	if (typeof source === 'object' && source.nodeType === 'SourceUnit') {
		logger.debug(`AST is already a SourceUnit`)
		try {
			return { [source.absolutePath]: writer.write(source) }
		} catch (error) {
			const err = new AstParseError(`Failed to parse AST into Solidity code`, {
				cause: error,
				meta: {
					code: 'parse_failed',
					sourcePath: source.absolutePath,
				},
			})
			logger.error(err.message)
			throw err
		}
	} else {
		logger.debug(`Parsing AST from a compilation output into SourceUnit(s)`)
		// Parse raw AST into typed nodes
		const reader = new ASTReader()
		/** @type {import('solc-typed-ast').SourceUnit[]} */
		let sourceUnits
		try {
			sourceUnits = reader.read(source)
		} catch (error) {
			const err = new AstParseError(`Failed to parse Solc AST into universal AST`, {
				cause: error,
				meta: {
					code: 'parse_failed',
					sourcePath: source.absolutePath,
				},
			})
			logger.error(err.message)
			throw err
		}

		if (sourceUnits.length === 0) {
			const err = new AstParseError(`Parsed Solc AST contains no SourceUnits`, {
				meta: {
					code: 'empty_ast',
					sourceUnitsCount: sourceUnits?.length ?? 0,
				},
			})
			logger.error(err.message)
			throw err
		}

		// Multiple units here means that it contained imports compiled alongside
		logger.debug(`Parsed ${sourceUnits.length} SourceUnit(s) from AST`)
		return sourceUnits.reduce(
			(acc, sourceUnit) => {
				try {
					acc[sourceUnit.absolutePath] = writer.write(sourceUnit)
					return acc
				} catch (error) {
					const err = new AstParseError(`Failed to parse universal AST into Solidity code`, {
						cause: error,
						meta: {
							code: 'parse_failed',
							sourcePath: sourceUnit.absolutePath,
						},
					})
					logger.error(err.message)
					throw err
				}
			},
			/** @type {import('./ExtractContractsFromAstResult.js').ExtractContractsFromAstResult} */ ({}),
		)
	}
}
