import { ASTReader, ASTWriter, DefaultASTWriterMapping, PrettyFormatter } from 'solc-typed-ast'

/**
 * Convert AST to Solidity source code
 *
 * This function handles both raw Solidity compiler AST output (i.e. likely solc output)
 * and pre-parsed universal AST nodes (i.e. likely solc-typed-ast output).
 *
 * Solc AST output will be parsed into universal AST format using ASTReader. Note that the format changed
 * in 0.8.0, which the ASTReader will figure out and handle correctly.
 *
 * @param {import('solc-typed-ast').ASTNode | import('../../types.js').SolcAst} source - The AST source unit to convert
 * @param {import('../../types.js').ValidatedCompileBaseOptions} options
 * @param {import('../../types.js').Logger} [logger] - The logger
 * @returns {import('../../types.js').GenerateContractsFromAstResult} Mapping of source path to Solidity source code
 */
export const generateContractsFromAst = (source, options, logger = console) => {
	const formatter = new PrettyFormatter(4, 0)
	const writer = new ASTWriter(DefaultASTWriterMapping, formatter, options.solcVersion)
	logger.debug(`Converting AST node to Solidity source code with solc version: ${options.solcVersion}`)

	// If the AST is already an universal AST tree, we don't need to parse it (it probably comes from solc-typed-ast)
	// Otherwise it comes from the solc compilation output and we need to parse the json
	if (typeof source === 'object' && source.nodeType === 'SourceUnit') {
		logger.debug(`AST is already a SourceUnit`)
		// TODO: check if this can throw and handle it
		return { [source.absolutePath]: writer.write(source) }
	} else {
		logger.debug(`Parsing AST from a compilation output into SourceUnit(s)`)
		// Parse raw AST into typed nodes
		const reader = new ASTReader()
		const sourceUnits = reader.read(source)
		if (!sourceUnits || sourceUnits.length === 0) {
			logger.error(`Failed to parse AST - no SourceUnits returned`)
			throw new Error(`Failed to parse AST into SourceUnits`)
		}

		// Multiple units here means that it contained imports compiled alongside
		logger.debug(`Parsed ${sourceUnits.length} SourceUnit(s) from AST`)
		return sourceUnits.reduce(
			(acc, sourceUnit) => {
				// TODO: check if this can throw and handle it
				acc[sourceUnit.absolutePath] = writer.write(sourceUnit)
				return acc
			},
			/** @type {import('../../types.js').GenerateContractsFromAstResult} */ ({}),
		)
	}
}
