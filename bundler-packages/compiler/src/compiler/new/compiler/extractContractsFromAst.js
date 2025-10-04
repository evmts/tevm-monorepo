import { createLogger } from '@tevm/logger'
import { ASTWriter, DefaultASTWriterMapping, PrettyFormatter, SourceUnit } from 'solc-typed-ast'
import { defaults } from './internal/defaults.js'
import { AstParseError } from './internal/errors.js'
import { solcAstToAstNode } from './internal/solcAstToAstNode.js'

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

	const sourceUnit = ast instanceof SourceUnit ? ast : solcAstToAstNode(ast, logger)
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
