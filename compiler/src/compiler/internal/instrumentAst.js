import { FunctionVisibility, StateVariableVisibility } from 'solc-typed-ast'

/**
 * Instrument an AST to expose internal variables and methods and mark functions as virtual to allow shadowing the implementation
 *
 * @param {import('solc-typed-ast').SourceUnit} astNode - The AST node to instrument
 * @param {import('./InstrumentAstOptions.js').InstrumentAstOptions} options - The options to instrument the source
 * @param {import('@tevm/logger').Logger} logger - The logger
 * @returns {import('solc-typed-ast').SourceUnit} The instrumented AST
 */
export const instrumentAst = (astNode, options, logger) => {
	const filteredContracts = options.contractFilter
		? astNode.vContracts.filter((contract) => contract.name === options.contractFilter)
		: astNode.vContracts

	filteredContracts.forEach((contract) => {
		if (options.exposeInternalFunctions || options.markFunctionsAsVirtual) {
			contract.vFunctions.forEach((node) => {
				if (
					options.exposeInternalFunctions &&
					// We do only want to expose internal/private functions, and not blindly turn them public as it would change the behavior of external functions
					(node.visibility === FunctionVisibility.Private || node.visibility === FunctionVisibility.Internal)
				) {
					logger.debug(
						{ contract: contract.name, function: node.name, previousVisibility: node.visibility },
						'Exposing internal function',
					)
					node.visibility = FunctionVisibility.Public
				}
				if (options.markFunctionsAsVirtual) {
					node.virtual = true
				}
			})
		}

		contract.vStateVariables.forEach((node) => {
			if (options.exposeInternalVariables && node.visibility !== StateVariableVisibility.Public) {
				logger.debug(
					{ contract: contract.name, variable: node.name, previousVisibility: node.visibility },
					'Exposing internal variable',
				)
				node.visibility = StateVariableVisibility.Public
			}
		})
	})

	return astNode
}
