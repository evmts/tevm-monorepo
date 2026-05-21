import { ASTReader } from 'solc-typed-ast'
import { AstParseError } from './internal/errors.js'

/**
 * Parse sources object from SolcOutput['sources'] into typed AST SourceUnit nodes
 *
 * @param {{ [sourceFile: string]: import('@tevm/solc').SolcSourceEntry }} sources - The sources object from SolcOutput.sources
 * @param {import('@tevm/logger').Logger} logger - Logger instance
 * @returns {import('solc-typed-ast').SourceUnit[]} Array of all source units from compilation
 * @throws {AstParseError} With code 'parse_failed' if reading fails
 * @throws {AstParseError} With code 'empty_ast' if no source units returned
 * @example
 * import { solcSourcesToAstNodes } from './solcSourcesToAstNodes.js'
 * import { createLogger } from '@tevm/logger'
 *
 * const logger = createLogger({ name: '@tevm/compiler' })
 * const sources = solcOutput.sources
 * const sourceUnits = solcSourcesToAstNodes(sources, logger)
 * // Returns array of all SourceUnits with cross-references intact
 */
export const solcSourcesToAstNodes = (sources, logger) => {
	const reader = new ASTReader()
	const sourcePaths = Object.keys(sources)

	logger.debug(`Parsing ${sourcePaths.length} source file(s) into AST nodes`)

	/** @type {import('solc-typed-ast').SourceUnit[]} */
	let sourceUnits
	try {
		sourceUnits = reader.read({ sources })
	} catch (error) {
		const err = new AstParseError(`Failed to parse sources into AST nodes`, {
			cause: error,
			meta: {
				code: 'parse_failed',
				sources: sourcePaths,
			},
		})
		logger.error(err.message)
		throw err
	}

	if (sourceUnits.length === 0) {
		const err = new AstParseError(`Parsed AST contains no source units`, {
			meta: {
				code: 'empty_ast',
				sources: sourcePaths,
			},
		})
		logger.error(err.message)
		throw err
	}

	logger.debug(`Parsed ${sourceUnits.length} source unit(s) from sources`)
	return sourceUnits
}
