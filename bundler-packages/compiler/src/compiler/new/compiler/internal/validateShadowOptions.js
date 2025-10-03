import { SourceUnit } from 'solc-typed-ast'
import { defaults } from './defaults.js'
import { NotSupportedError, ShadowValidationError } from './errors.js'
import { solcAstToAstNode } from './solcAstToAstNode.js'

/**
 * Verify that shadow options are consistent with the source language and return defaults if acceptable in this case
 *
 * When using compileWithShadowSource, we pass only a single source so we don't need to validate the path of the target
 *
 * @param {import('../AstInput.js').AstInput[]} astSources - The compiled source (if shadowing a single source) or sources (if there are multiple files)
 * @param {import('../CompileSourceWithShadowOptions.js').CompileSourceWithShadowOptions} options - The options to validate
 * @param {import('@tevm/solc').SolcLanguage} sourceLanguage - The language of the source code
 * @param {boolean} validatePath - Whether to validate the path of the target
 * @param {import('@tevm/logger').Logger} logger - The logger
 * @returns {import('./ValidatedShadowOptions.js').ValidatedShadowOptions} The validated options
 */
export const validateShadowOptions = (astSources, options, sourceLanguage, validatePath, logger) => {
	if (options.sourceLanguage === 'Yul') {
		const err = new NotSupportedError('Yul is not supported yet', {
			meta: { code: 'yul_not_supported' },
		})
		logger.error(err.message)
		throw err
	}

	if (options.shadowLanguage === 'SolidityAST') {
		const err = new ShadowValidationError('Shadow language cannot be AST - must be Solidity or Yul', {
			meta: { code: 'invalid_shadow_language' },
		})
		logger.error(err.message)
		throw err
	}

	const astSourceNodes = astSources.map((ast) => (ast instanceof SourceUnit ? ast : solcAstToAstNode(ast, logger)))

	const injectIntoContractPath = validateContractPath(
		astSourceNodes,
		options.injectIntoContractPath,
		validatePath,
		logger,
	)
	const injectIntoContractName = validateContractName(
		astSourceNodes,
		injectIntoContractPath,
		options.injectIntoContractName,
		logger,
	)

	if (!options.shadowMergeStrategy) {
		logger.debug(
			'No shadowMergeStrategy provided; using default "safe", which will throw an error if a shadow function name conflicts with an existing one',
		)
	}

	return {
		astSourceNodes,
		sourceLanguage,
		shadowLanguage: options.shadowLanguage ?? defaults.language,
		injectIntoContractPath,
		injectIntoContractName,
		shadowMergeStrategy: options.shadowMergeStrategy ?? 'safe',
	}
}

/**
 * Validate and return the contract path
 * @param {import('solc-typed-ast').SourceUnit[]} astSources - The compiled sources ast
 * @param {string | undefined} injectIntoContractPath - The contract path to inject the shadow code into
 * @param {boolean} validatePath - Whether to validate the path of the target
 * @param {import('@tevm/logger').Logger} logger - The logger
 * @returns {string} The contract path
 */
const validateContractPath = (astSources, injectIntoContractPath, validatePath, logger) => {
	if (!validatePath) return defaults.injectIntoContractPath

	if (astSources.length === 0) {
		const err = new ShadowValidationError('Source compilation resulted in no contract files', {
			meta: { code: 'missing_contract_files' },
		})
		logger.error(err.message)
		throw err
	}

	const contractPaths = astSources.map((ast) => ast.absolutePath)
	if (contractPaths.length > 1 && !injectIntoContractPath) {
		const err = new ShadowValidationError(
			'injectIntoContractPath is required when using AST source with multiple contract files',
			{
				meta: {
					code: 'missing_inject_path',
					sourceFilePaths: contractPaths,
				},
			},
		)
		logger.error(err.message)
		throw err
	}

	if (injectIntoContractPath && !contractPaths.includes(injectIntoContractPath)) {
		const err = new ShadowValidationError(
			'injectIntoContractPath is not a valid contract file or does not match the source file',
			{
				meta: { code: 'invalid_inject_path', providedPath: injectIntoContractPath, sourceFilePaths: contractPaths },
			},
		)
		logger.error(err.message)
		throw err
	}

	if (!injectIntoContractPath) {
		logger.warn('No injectIntoContractPath provided; using the first contract file')
	}

	logger.debug(`Using contract at path ${injectIntoContractPath} to inject shadow code`)
	return injectIntoContractPath ?? /** @type {string} */ (contractPaths[0])
}

/**
 * Validate and return the contract name
 * @param {import('solc-typed-ast').SourceUnit[]} astSources - The compiled sources ast
 * @param {string} injectIntoContractPath - The contract path to inject the shadow code into
 * @param {string | undefined} injectIntoContractName - The contract name to inject the shadow code into
 * @param {import('@tevm/logger').Logger} logger - The logger
 * @returns {string} The contract name
 */
const validateContractName = (astSources, injectIntoContractPath, injectIntoContractName, logger) => {
	const ast = astSources.find((ast) => ast.absolutePath === injectIntoContractPath)
	if (!ast) {
		const err = new ShadowValidationError(
			'injectIntoContractPath is not a valid contract file or does not match the source file',
			{
				meta: { code: 'invalid_inject_path', providedPath: injectIntoContractPath },
			},
		)
		logger.error(err.message)
		throw err
	}

	const contractNames = ast.vContracts.map((contract) => contract.name)
	if (contractNames.length === 0) {
		const err = new ShadowValidationError('Source compilation resulted in no contracts', {
			meta: { code: 'missing_contracts' },
		})
		logger.error(err.message)
		throw err
	}
	if (contractNames.length > 1 && !injectIntoContractName) {
		const err = new ShadowValidationError(
			'injectIntoContractName is required when using AST source with multiple contracts in the target file',
			{
				meta: {
					code: 'missing_inject_name',
					sourceContractNames: contractNames,
				},
			},
		)
		logger.error(err.message)
		throw err
	}

	logger.debug(`Using contract ${injectIntoContractName} to inject shadow code`)
	return injectIntoContractName ?? /** @type {string} */ (contractNames[0])
}
