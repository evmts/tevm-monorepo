import { compileContracts } from './internal/compileContracts.js'
import { generateContractsFromAst } from './internal/generateContractsFromAst.js'
import { getSolc } from './internal/getSolc.js'
import { validateSource } from './internal/validateSource.js'

/**
 * Compile a single source code string
 *
 * @template TLanguage extends import('@tevm/solc').SolcLanguage
 * @param {TLanguage extends 'SolidityAST' ? import('solc-typed-ast').ASTNode | import('../types.js').SolcAst : string} source - The source code to compile
 * @param {import('../types.js').CompileBaseOptions} [options]
 * @param {import('../types.js').Logger} [logger] - The logger
 * @returns {Promise<import('../types.js').CompileSourceResult>}
 */
export const compileSource = async (source, options, logger = console) => {
	const validatedOptions = validateSource(source, options ?? {}, logger)
	const solc = await getSolc(validatedOptions.solcVersion, logger)

	if (validatedOptions.language === 'SolidityAST') {
		const soliditySourceCode = generateContractsFromAst(source, validatedOptions, logger)
		// AST might generate multiple source files
		return compileContracts(soliditySourceCode, solc, validatedOptions, logger)
	}

	// With a direct source code though this corresponds to a single source file so we add an "anonymous" source file
	return compileContracts({ '<anonymous>': source }, solc, validatedOptions, logger)
}
