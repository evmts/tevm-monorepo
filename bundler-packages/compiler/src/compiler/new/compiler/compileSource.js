import { createLogger } from '@tevm/logger'
import { extractContractsFromAst } from './extractContractsFromAst.js'
import { compileContracts } from './internal/compileContracts.js'
import { defaults } from './internal/defaults.js'
import { getSolc } from './internal/getSolc.js'
import { validateBaseOptions } from './internal/validateBaseOptions.js'

/**
 * Compile a single source code string
 *
 * @template TLanguage extends import('@tevm/solc').SolcLanguage
 * @param {TLanguage extends 'SolidityAST' ? import('solc-typed-ast').ASTNode | import('@tevm/solc').SolcAst : string} source - The source code to compile
 * @param {import('./CompileBaseOptions.js').CompileBaseOptions} [options]
 * @returns {Promise<import('./CompileSourceResult.js').CompileSourceResult>}
 */
export const compileSource = async (source, options) => {
	const logger = createLogger({ name: '@tevm/compiler', level: options?.loggingLevel ?? defaults.loggingLevel })
	const validatedOptions = validateBaseOptions(source, options ?? {}, logger)
	const solc = await getSolc(validatedOptions.solcVersion, logger)

	if (validatedOptions.language === 'SolidityAST') {
		const soliditySourceCode = extractContractsFromAst(source, validatedOptions)
		// AST might generate multiple source files
		return compileContracts(soliditySourceCode, solc, validatedOptions, logger)
	}

	// With a direct source code though this corresponds to a single source file so we add an "anonymous" source file path
	return compileContracts({ [defaults.anonymousSourcePath]: source }, solc, validatedOptions, logger)
}
