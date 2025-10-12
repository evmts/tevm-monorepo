import { createLogger } from '@tevm/logger'
import { extractContractsFromAstNodes } from './extractContractsFromAstNodes.js'
import { defaults } from './internal/defaults.js'
import { solcSourcesToAstNodes } from './solcSourcesToAstNodes.js'

/**
 * Convert a Solc compilation output to Solidity source code (source file -> code)
 *
 * @param {import('@tevm/solc').SolcOutput} solcOutput - The Solc compilation output to convert
 * @param {import('./CompileBaseOptions.js').CompileBaseOptions} options - Compilation options
 * @returns {{ [sourcePath: string]: string }} Mapping of source path to Solidity source code
 * @example
 * import { extractContractsFromSolcOutput } from './extractContractsFromSolcOutput.js'
 *
 * const sources = extractContractsFromSolcOutput(solcOutput, {
 *   solcVersion: '0.8.20'
 * })
 *
 * // Returns:
 * // {
 * //   "contracts/Main.sol": "import './Lib.sol';\ncontract Main {...}",
 * //   "contracts/Lib.sol": "library Lib {...}"
 * // }
 */
export const extractContractsFromSolcOutput = (solcOutput, options) => {
	const logger = createLogger({ name: '@tevm/compiler', level: options?.loggingLevel ?? defaults.loggingLevel })
	logger.debug(`Converting Solc compilation output to Solidity source code with solc version: ${options.solcVersion}`)

	if (!solcOutput.sources || Object.keys(solcOutput.sources).length === 0) {
		logger.warn('No sources found in Solc output')
		return {}
	}

	const sourceUnits = solcSourcesToAstNodes(solcOutput.sources, logger)
	const { sources } = extractContractsFromAstNodes(sourceUnits, options)

	logger.debug(`Converted ${Object.keys(sources).length} source file(s) to Solidity code`)
	return sources
}
