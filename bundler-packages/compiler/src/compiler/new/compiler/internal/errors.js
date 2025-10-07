/**
 * Compiler-specific custom errors for the new compiler API
 * These errors provide detailed diagnostic information with error codes for specific scenarios
 */

/**
 * Parameters for constructing a VersionResolutionError.
 * @typedef {Object} VersionResolutionErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {Error|unknown} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {{ code: 'no_pragma' | 'no_compatible_version' | 'version_mismatch', source?: string, specifiers?: string[], availableVersions?: string[], providedVersion?: string, compatibleVersions?: string[] }} [meta] - Error metadata with specific code.
 */

/**
 * Represents errors related to resolving the correct Solidity compiler version.
 *
 * Error codes:
 * - `no_pragma`: No pragma statement found in source code
 * - `no_compatible_version`: No compatible version found for pragma specifiers
 * - `version_mismatch`: Provided version doesn't match source requirements (when throwOnVersionMismatch is true)
 *
 * @example
 * ```javascript
 * import { VersionResolutionError } from './errors.js'
 *
 * try {
 *   // Missing pragma
 *   throw new VersionResolutionError('No pragma found', {
 *     meta: { code: 'no_pragma', source }
 *   })
 * } catch (error) {
 *   if (error instanceof VersionResolutionError) {
 *     console.log('Error code:', error.meta?.code)
 *   }
 * }
 * ```
 */
export class VersionResolutionError extends Error {
	/**
	 * Constructs a VersionResolutionError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {VersionResolutionErrorParameters} [args={}] - Additional parameters for the error.
	 */
	constructor(message, args = {}) {
		super(message, { cause: args.cause })

		this.name = 'VersionResolutionError'
		this._tag = 'VersionResolutionError'
		this.meta = args.meta
	}
}

/**
 * Parameters for constructing a SolcError.
 * @typedef {Object} SolcErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {Error|unknown} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {{ code: 'instantiation_failed' | 'not_loaded', version?: string }} [meta] - Error metadata with specific code.
 */

/**
 * Represents errors related to loading and instantiating the Solidity compiler.
 *
 * Error codes:
 * - `instantiation_failed`: Failed to create solc instance for the requested version
 * - `not_loaded`: Solc instance not loaded yet
 *
 * Common causes:
 * - Network issues preventing download of solc binary
 * - Invalid or unsupported solc version
 * - Corrupted solc binary
 *
 * @example
 * ```javascript
 * import { SolcError } from './errors.js'
 *
 * try {
 *   const solc = await getSolc('0.8.999')
 * } catch (error) {
 *   if (error instanceof SolcError) {
 *     console.log('Code:', error.meta?.code)
 *     console.log('Version:', error.meta?.version)
 *   }
 * }
 * ```
 */
export class SolcError extends Error {
	/**
	 * Constructs a SolcError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {SolcErrorParameters} [args={}] - Additional parameters for the error.
	 */
	constructor(message, args = {}) {
		super(message, { cause: args.cause })

		this.name = 'SolcError'
		this._tag = 'SolcError'
		this.meta = args.meta
	}
}

/**
 * Parameters for constructing a FileValidationError.
 * @typedef {Object} FileValidationErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {Error|unknown} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {{ code: 'invalid_array' | 'empty_array' | 'invalid_path' | 'no_extension' | 'unsupported_extension' | 'mixed_extensions' | 'extension_mismatch', filePaths?: string[], invalidPath?: string, extensions?: string[], language?: string, extension?: string, expectedExtension?: string }} [meta] - Error metadata with specific code.
 */

/**
 * Represents errors related to file path validation.
 *
 * Error codes:
 * - `invalid_array`: File paths must be an array
 * - `empty_array`: At least one file path required
 * - `invalid_path`: File path is not a valid string
 * - `no_extension`: File has no extension
 * - `unsupported_extension`: File extension not supported
 * - `mixed_extensions`: Multiple different extensions in single compilation
 * - `extension_mismatch`: Extension doesn't match specified language
 *
 * @example
 * ```javascript
 * import { FileValidationError } from './errors.js'
 *
 * try {
 *   validateFiles(['Contract.sol', 'Library.yul'])
 * } catch (error) {
 *   if (error instanceof FileValidationError) {
 *     console.log('Code:', error.meta?.code)
 *     console.log('Extensions:', error.meta?.extensions)
 *   }
 * }
 * ```
 */
export class FileValidationError extends Error {
	/**
	 * Constructs a FileValidationError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {FileValidationErrorParameters} [args={}] - Additional parameters for the error.
	 */
	constructor(message, args = {}) {
		super(message, { cause: args.cause })

		this.name = 'FileValidationError'
		this._tag = 'FileValidationError'
		this.meta = args.meta
	}
}

/**
 * Parameters for constructing a FileReadError.
 * @typedef {Object} FileReadErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {Error|unknown} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {{ code: 'read_failed' | 'json_parse_failed', filePath?: string, absolutePath?: string }} [meta] - Error metadata with specific code.
 */

/**
 * Represents errors when reading files from the filesystem.
 *
 * Error codes:
 * - `read_failed`: Could not read file (permissions, not found, locked, etc.)
 * - `json_parse_failed`: Failed to parse JSON content (for AST files)
 *
 * @example
 * ```javascript
 * import { FileReadError } from './errors.js'
 *
 * try {
 *   await compileFiles(['./Missing.sol'])
 * } catch (error) {
 *   if (error instanceof FileReadError) {
 *     console.log('Code:', error.meta?.code)
 *     console.log('Path:', error.meta?.filePath)
 *   }
 * }
 * ```
 */
export class FileReadError extends Error {
	/**
	 * Constructs a FileReadError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {FileReadErrorParameters} [args={}] - Additional parameters for the error.
	 */
	constructor(message, args = {}) {
		super(message, { cause: args.cause })

		this.name = 'FileReadError'
		this._tag = 'FileReadError'
		this.meta = args.meta
	}
}

/**
 * Parameters for constructing a CompilerOutputError.
 * @typedef {Object} CompilerOutputErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {Error|unknown} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {{ code: 'compilation_errors' | 'missing_source_output', errors?: import('@tevm/solc').SolcErrorEntry[] }} [meta] - Error metadata with specific code.
 */

/**
 * Represents errors when compiler output doesn't contain expected data.
 *
 * Error codes:
 * - `compilation_errors`: Compilation errors occurred
 *
 * This typically indicates:
 * - Mismatch between input sources and output structure
 * - Solc failed to parse the source file
 * - Internal compiler inconsistency
 *
 * @example
 * ```javascript
 * import { CompilerOutputError } from './errors.js'
 *
 * try {
 *   const result = compileContracts(sources, solc, options)
 * } catch (error) {
 *   if (error instanceof CompilerOutputError) {
 *     console.log('Code:', error.meta?.code)
 *     console.log('Expected:', error.meta?.sourcePath)
 *     console.log('Available:', error.meta?.availableSources)
 *   }
 * }
 * ```
 */
export class CompilerOutputError extends Error {
	/**
	 * Constructs a CompilerOutputError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {CompilerOutputErrorParameters} [args={}] - Additional parameters for the error.
	 */
	constructor(message, args = {}) {
		super(message, { cause: args.cause })

		this.name = 'CompilerOutputError'
		this._tag = 'CompilerOutputError'
		this.meta = args.meta
	}
}

/**
 * Parameters for constructing an AstParseError.
 * @typedef {Object} AstParseErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {Error|unknown} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {{ code: 'parse_failed' | 'empty_ast' | 'invalid_source_ast' | 'invalid_instrumented_ast', sources?: string }} [meta] - Error metadata with specific code.
 */

/**
 * Represents errors when parsing Solidity AST fails.
 *
 * Error codes:
 * - `parse_failed`: ASTReader failed to parse AST into SourceUnits
 * - `empty_ast`: ASTReader parsed an AST with no sources
 * - `invalid_ast_source`: AST source is not a valid SourceUnit
 * - `invalid_instrumented_ast`: Instrumented AST is not a valid SourceUnit
 *
 * This can happen when:
 * - AST structure is malformed or corrupted
 * - AST format incompatible with parser version
 * - Source code syntax produces unparseable AST
 *
 * @example
 * ```javascript
 * import { AstParseError } from './errors.js'
 *
 * try {
 *   const result = extractContractsFromSolcOutput(ast, options)
 * } catch (error) {
 *   if (error instanceof AstParseError) {
 *     console.log('Code:', error.meta?.code)
 *     console.log('Units found:', error.meta?.sourceUnitsCount)
 *   }
 * }
 * ```
 */
export class AstParseError extends Error {
	/**
	 * Constructs an AstParseError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {AstParseErrorParameters} [args={}] - Additional parameters for the error.
	 */
	constructor(message, args = {}) {
		super(message, { cause: args.cause })

		this.name = 'AstParseError'
		this._tag = 'AstParseError'
		this.meta = args.meta
	}
}

/**
 * Parameters for constructing a ShadowValidationError.
 * @typedef {Object} ShadowValidationErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {Error|unknown} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {{ code: 'invalid_shadow_language' | 'missing_inject_path' | 'missing_inject_name' | 'missing_contract_files' | 'missing_contracts' | 'invalid_inject_path', providedPath?: string | undefined, providedName?: string | undefined, sourceFilePaths?: string[], sourceContractNames?: string[] }} [meta] - Error metadata with specific code.
 */

/**
 * Represents errors when validating shadow compilation options.
 *
 * Error codes:
 * - `invalid_shadow_language`: Shadow language must be Solidity or Yul
 * - `missing_inject_path`: AST source requires injectIntoContractPath when there are multiple contract files
 * - `missing_inject_name`: AST source requires injectIntoContractName when there are multiple contract files
 * - `missing_contract_files`: Source compilation resulted in no contract files
 * - `missing_contracts`: Source compilation resulted in no contracts
 * - `invalid_inject_path`: injectIntoContractPath is not a valid contract file
 *
 * When compiling from AST (language: 'SolidityAST'), both path and name are required
 * to identify where to inject the shadow contract.
 *
 * @example
 * ```javascript
 * import { ShadowValidationError } from './errors.js'
 *
 * try {
 *   validateShadowOptions(options, 'SolidityAST', logger)
 * } catch (error) {
 *   if (error instanceof ShadowValidationError) {
 *     console.log('Code:', error.meta?.code)
 *     console.log('Provided path:', error.meta?.providedPath)
 *     console.log('Provided name:', error.meta?.providedName)
 *   }
 * }
 * ```
 */
export class ShadowValidationError extends Error {
	/**
	 * Constructs a ShadowValidationError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {ShadowValidationErrorParameters} [args={}] - Additional parameters for the error.
	 */
	constructor(message, args = {}) {
		super(message, { cause: args.cause })

		this.name = 'ShadowValidationError'
		this._tag = 'ShadowValidationError'
		this.meta = args.meta
	}
}

/**
 * Parameters for constructing a NotSupportedError.
 * @typedef {Object} NotSupportedErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {Error|unknown} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 * @property {{ code: string }} [meta] - Error metadata with specific code.
 */

/**
 * Represents errors when a feature or operation is not supported.
 *
 * Common use cases:
 * - Unsupported language combinations (e.g., Yul shadow compilation)
 * - Unsupported compiler features
 * - Platform-specific limitations
 *
 * @example
 * ```javascript
 * import { NotSupportedError } from './errors.js'
 *
 * try {
 *   if (sourceLanguage === 'Yul') {
 *     throw new NotSupportedError(
 *       'Shadow compilation not supported for Yul',
 *       {
 *         meta: { code: 'yul_not_supported' }
 *       }
 *     )
 *   }
 * } catch (error) {
 *   if (error instanceof NotSupportedError) {
 *     console.log('Code:', error.meta?.code)
 *   }
 * }
 * ```
 */
export class NotSupportedError extends Error {
	/**
	 * Constructs a NotSupportedError.
	 *
	 * @param {string} message - Human-readable error message.
	 * @param {NotSupportedErrorParameters} [args={}] - Additional parameters for the error.
	 */
	constructor(message, args = {}) {
		super(message, { cause: args.cause })

		this.name = 'NotSupportedError'
		this._tag = 'NotSupportedError'
		this.meta = args.meta
	}
}
