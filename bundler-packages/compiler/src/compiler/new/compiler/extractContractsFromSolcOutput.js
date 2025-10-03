import { createLogger } from '@tevm/logger'
import { ASTReader, ASTWriter, DefaultASTWriterMapping, PrettyFormatter } from 'solc-typed-ast'
import { defaults } from './internal/defaults.js'
import { AstParseError } from './internal/errors.js'

/**
 * Convert a Solc compilation output to Solidity source code (source file -> code)
 *
 * @param {import('@tevm/solc').SolcOutput} solcOutput - The Solc compilation output to convert
 * @param {import('./internal/ValidatedCompileBaseOptions.js').ValidatedCompileBaseOptions} options
 * @returns {{ [sourcePath: string]: string }} Mapping of source path to Solidity source code
 * @example
 * {
 *   "contracts/Main.sol": "import './Lib.sol';\ncontract Main {...}",
 *   "contracts/Lib.sol": "library Lib {...}"
 * }
 */
export const extractContractsFromSolcOutput = (solcOutput, options) => {
	const logger = createLogger({ name: '@tevm/compiler', level: options?.loggingLevel ?? defaults.loggingLevel })
	const formatter = new PrettyFormatter(4, 0)
	const writer = new ASTWriter(DefaultASTWriterMapping, formatter, options.solcVersion)
	logger.debug(`Converting Solc compilation output to Solidity source code with solc version: ${options.solcVersion}`)

	// Parse raw AST into typed nodes
	const reader = new ASTReader()
	/** @type {import('solc-typed-ast').SourceUnit[]} */
	let sourceUnits
	try {
		logger.debug(`Parsing Solc compilation output into an AST node tree`)
		sourceUnits = reader.read(solcOutput)
	} catch (error) {
		const err = new AstParseError(`Failed to parse Solc AST into universal AST`, {
			cause: error,
			meta: {
				code: 'parse_failed',
				sources: Object.keys(solcOutput.sources).join(', '),
			},
		})
		logger.error(err.message)
		throw err
	}

	// TODO: pretty sure using this function and not getting any source unit is unintentional and should throw an error
	// (don't think it's even possible otherwise it would not be compiled)
	if (sourceUnits.length === 0) {
		const err = new AstParseError(`Parsed Solc compilation output contains no sources`, {
			meta: {
				code: 'empty_ast',
				sources: Object.keys(solcOutput.sources).join(', '),
			},
		})
		logger.error(err.message)
		throw err
	}

	logger.debug(`Parsed ${sourceUnits.length} source AST nodes from Solc compilation output`)
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
						sources: Object.keys(solcOutput.sources).join(', '),
					},
				})
				logger.error(err.message)
				throw err
			}
		},
		/** @type {{ [sourcePath: string]: string }} */ ({}),
	)
}
