import { createLogger } from '@tevm/logger'
import { ASTReader, ASTWriter, DefaultASTWriterMapping, PrettyFormatter } from 'solc-typed-ast'
import { defaults } from './internal/defaults.js'
import { AstParseError } from './internal/errors.js'

/**
 * Convert an AST to Solidity source code
 *
 * @param {import('./AstInput.js').AstInput} ast - The AST to convert
 * @param {import('./internal/ValidatedCompileBaseOptions.js').ValidatedCompileBaseOptions} options
 * @returns {string} Solidity source code
 */
export const extractContractsFromAst = (ast, options) => {
	const logger = createLogger({ name: '@tevm/compiler', level: options?.loggingLevel ?? defaults.loggingLevel })
	const formatter = new PrettyFormatter(4, 0)
	const writer = new ASTWriter(DefaultASTWriterMapping, formatter, options.solcVersion)
	logger.debug(`Converting AST to Solidity source code with solc version: ${options.solcVersion}`)

	// Parse AST into a source unit
	const reader = new ASTReader()
	/** @type {import('solc-typed-ast').SourceUnit | undefined} */
	let sourceUnit
	try {
		logger.debug(`Parsing Solc compilation output into an AST node tree`)
		sourceUnit = reader.read({ sources: { [ast.absolutePath]: ast } })[0]
	} catch (error) {
		const err = new AstParseError(`Failed to parse AST into a source unit`, {
			cause: error,
			meta: {
				code: 'parse_failed',
				sources: ast.absolutePath,
			},
		})
		logger.error(err.message)
		throw err
	}

	// This should never happen
	if (!sourceUnit) {
		const err = new AstParseError(`Parsed AST contains no sources`, {
			meta: {
				code: 'empty_ast',
				sources: ast.absolutePath,
			},
		})
		logger.error(err.message)
		throw err
	}
	logger.debug(`Parsed source unit from AST`)

	try {
		return writer.write(sourceUnit)
	} catch (error) {
		const err = new AstParseError(`Failed to parse source unit into Solidity code`, {
			cause: error,
			meta: {
				code: 'parse_failed',
				sources: ast.absolutePath,
			},
		})
		logger.error(err.message)
		throw err
	}
}
