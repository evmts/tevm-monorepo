import { createLogger } from '@tevm/logger'
import { ASTWriter, DefaultASTWriterMapping, PrettyFormatter } from 'solc-typed-ast'
import { defaults } from './internal/defaults.js'
import { AstParseError } from './internal/errors.js'

/**
 * @template {boolean} TWithSourceMap
 * @typedef {TWithSourceMap extends true ? { [sourcePath: string]: Map<import('solc-typed-ast').ASTNode, [number, number]> } : undefined} TSourceMaps
 */

/**
 * Convert SourceUnit AST nodes to Solidity source code
 *
 * @template {boolean} [TWithSourceMap=false]
 * @param {import('solc-typed-ast').SourceUnit[]} sourceUnits - Array of source units (from solcSourcesToAstNodes)
 * @param {import('./CompileBaseOptions.js').CompileBaseOptions & { withSourceMap?: TWithSourceMap }} options - Configuration options
 * @returns {{ sources: { [sourcePath: string]: string }, sourceMaps: TSourceMaps<TWithSourceMap> }} Object containing sources mapping and optional source maps
 * @throws {AstParseError} With code 'parse_failed' if writing any source fails
 * @example
 * import { extractContractsFromAstNodes } from './extractContractsFromAstNodes.js'
 * import { solcSourcesToAstNodes } from './internal/solcSourcesToAstNodes.js'
 * import { createLogger } from '@tevm/logger'
 *
 * const logger = createLogger({ name: '@tevm/compiler' })
 * const sourceUnits = solcSourcesToAstNodes(solcOutput.sources, logger)
 *
 * // Manipulate the AST source units...
 *
 * // Without source maps
 * const { sources } = extractContractsFromAstNodes(sourceUnits, {
 *   solcVersion: '0.8.20'
 * })
 *
 * // With source maps
 * const { sources, sourceMaps } = extractContractsFromAstNodes(sourceUnits, {
 *   solcVersion: '0.8.20',
 *   withSourceMap: true
 * })
 */
export const extractContractsFromAstNodes = (sourceUnits, options) => {
	const logger = createLogger({ name: '@tevm/compiler', level: options?.loggingLevel ?? defaults.loggingLevel })
	const formatter = new PrettyFormatter(4, 0)
	const writer = new ASTWriter(DefaultASTWriterMapping, formatter, options.solcVersion ?? defaults.solcVersion)
	logger.debug(`Writing AST nodes to Solidity code with solc version: ${options.solcVersion ?? defaults.solcVersion}`)

	/** @type {{ [sourcePath: string]: string }} */
	const sources = {}
	/** @type {TSourceMaps<TWithSourceMap>} */
	const sourceMaps = /** @type {any} */ (options.withSourceMap ? {} : undefined)

	for (const sourceUnit of sourceUnits) {
		logger.debug(`Writing source unit: ${sourceUnit.absolutePath}${options.withSourceMap ? ' with source map' : ''}`)
		const sourceMap = options.withSourceMap ? new Map() : undefined
		try {
			const source = writer.write(sourceUnit, sourceMap)
			sources[sourceUnit.absolutePath] = source
			if (options.withSourceMap && sourceMaps && sourceMap) {
				sourceMaps[sourceUnit.absolutePath] = sourceMap
			}
			logger.debug(`Wrote source unit: ${sourceUnit.absolutePath}`)
		} catch (error) {
			const err = new AstParseError(`Failed to write source unit to Solidity code`, {
				cause: error,
				meta: {
					code: 'parse_failed',
					sources: [sourceUnit.absolutePath],
				},
			})
			logger.error(err.message)
			throw err
		}
	}

	logger.debug(`Extracted ${Object.keys(sources).length} source units`)
	return { sources, sourceMaps }
}
