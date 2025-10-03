import { ASTReader } from 'solc-typed-ast'
import { AstParseError } from './errors.js'

/**
 * Parse a Solc AST into a source unit node
 * @param {import('@tevm/solc').SolcAst} ast - The Solc AST to parse
 * @param {import('@tevm/logger').Logger} logger - The logger
 * @returns {import('solc-typed-ast').SourceUnit} The source unit
 */
export const solcAstToAstNode = (ast, logger) => {
	const reader = new ASTReader()

	/** @type {import('solc-typed-ast').SourceUnit | undefined} */
	let sourceUnit
	try {
		logger.debug(`Parsing Solc compilation output into an AST node tree`)
		sourceUnit = reader.read({ sources: { [ast.absolutePath]: ast } })[0]
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
		return sourceUnit
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
}
