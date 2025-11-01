import type { SolcErrorEntry } from '@tevm/solc'
import { describe, expect, it } from 'vitest'
import {
	AstParseError,
	CompilerOutputError,
	FileReadError,
	FileValidationError,
	NotSupportedError,
	ShadowValidationError,
	SolcError,
	VersionResolutionError,
} from './errors.js'

describe('VersionResolutionError', () => {
	describe('constructor', () => {
		it('should create error with message', () => {
			const error = new VersionResolutionError('No pragma found')

			expect(error).toBeInstanceOf(Error)
			expect(error.message).toBe('No pragma found')
			expect(error.name).toBe('VersionResolutionError')
			expect(error._tag).toBe('VersionResolutionError')
		})

		it('should create error with cause', () => {
			const cause = new Error('Original error')
			const error = new VersionResolutionError('No pragma found', { cause })

			expect(error.cause).toBe(cause)
		})

		it('should create error with no_pragma code', () => {
			const error = new VersionResolutionError('No pragma found', {
				meta: { code: 'no_pragma', source: 'contract Test {}' },
			})

			expect(error.meta?.code).toBe('no_pragma')
			expect(error.meta?.source).toBe('contract Test {}')
		})

		it('should create error with no_compatible_version code', () => {
			const error = new VersionResolutionError('No compatible version found', {
				meta: {
					code: 'no_compatible_version',
					specifiers: ['^0.8.0'],
					availableVersions: ['0.7.0', '0.7.6'],
				},
			})

			expect(error.meta?.code).toBe('no_compatible_version')
			expect(error.meta?.specifiers).toEqual(['^0.8.0'])
			expect(error.meta?.availableVersions).toEqual(['0.7.0', '0.7.6'])
		})

		it('should create error with version_mismatch code', () => {
			const error = new VersionResolutionError('Version mismatch', {
				meta: {
					code: 'version_mismatch',
					providedVersion: '0.8.0',
					compatibleVersions: ['^0.8.20'],
				},
			})

			expect(error.meta?.code).toBe('version_mismatch')
			expect(error.meta?.providedVersion).toBe('0.8.0')
			expect(error.meta?.compatibleVersions).toEqual(['^0.8.20'])
		})

		it('should create error without metadata', () => {
			const error = new VersionResolutionError('Generic error')

			expect(error.meta).toBeUndefined()
		})
	})

	describe('inheritance', () => {
		it('should be instance of Error', () => {
			const error = new VersionResolutionError('Test')
			expect(error).toBeInstanceOf(Error)
		})

		it('should be instance of VersionResolutionError', () => {
			const error = new VersionResolutionError('Test')
			expect(error).toBeInstanceOf(VersionResolutionError)
		})
	})

	describe('type guards', () => {
		it('should identify VersionResolutionError by instance', () => {
			const error = new VersionResolutionError('Test')
			expect(error instanceof VersionResolutionError).toBe(true)
		})

		it('should identify VersionResolutionError by name', () => {
			const error = new VersionResolutionError('Test')
			expect(error.name).toBe('VersionResolutionError')
		})

		it('should identify VersionResolutionError by tag', () => {
			const error = new VersionResolutionError('Test')
			expect(error._tag).toBe('VersionResolutionError')
		})

		it('should not identify other errors as VersionResolutionError', () => {
			const error = new Error('Test')
			expect(error instanceof VersionResolutionError).toBe(false)
		})
	})
})

describe('SolcError', () => {
	describe('constructor', () => {
		it('should create error with message', () => {
			const error = new SolcError('Failed to instantiate solc')

			expect(error).toBeInstanceOf(Error)
			expect(error.message).toBe('Failed to instantiate solc')
			expect(error.name).toBe('SolcError')
			expect(error._tag).toBe('SolcError')
		})

		it('should create error with cause', () => {
			const cause = new Error('Network error')
			const error = new SolcError('Failed to instantiate solc', { cause })

			expect(error.cause).toBe(cause)
		})

		it('should create error with instantiation_failed code', () => {
			const error = new SolcError('Failed to instantiate solc', {
				meta: { code: 'instantiation_failed', version: '0.8.20' },
			})

			expect(error.meta?.code).toBe('instantiation_failed')
			expect(error.meta?.version).toBe('0.8.20')
		})

		it('should create error with not_loaded code', () => {
			const error = new SolcError('Solc not loaded', {
				meta: { code: 'not_loaded' },
			})

			expect(error.meta?.code).toBe('not_loaded')
		})

		it('should create error without metadata', () => {
			const error = new SolcError('Generic error')

			expect(error.meta).toBeUndefined()
		})
	})

	describe('inheritance', () => {
		it('should be instance of Error', () => {
			const error = new SolcError('Test')
			expect(error).toBeInstanceOf(Error)
		})

		it('should be instance of SolcError', () => {
			const error = new SolcError('Test')
			expect(error).toBeInstanceOf(SolcError)
		})
	})

	describe('type guards', () => {
		it('should identify SolcError by instance', () => {
			const error = new SolcError('Test')
			expect(error instanceof SolcError).toBe(true)
		})

		it('should identify SolcError by name', () => {
			const error = new SolcError('Test')
			expect(error.name).toBe('SolcError')
		})

		it('should identify SolcError by tag', () => {
			const error = new SolcError('Test')
			expect(error._tag).toBe('SolcError')
		})
	})
})

describe('FileValidationError', () => {
	describe('constructor', () => {
		it('should create error with message', () => {
			const error = new FileValidationError('Invalid file path')

			expect(error).toBeInstanceOf(Error)
			expect(error.message).toBe('Invalid file path')
			expect(error.name).toBe('FileValidationError')
			expect(error._tag).toBe('FileValidationError')
		})

		it('should create error with cause', () => {
			const cause = new Error('Validation failed')
			const error = new FileValidationError('Invalid file path', { cause })

			expect(error.cause).toBe(cause)
		})

		it('should create error with invalid_array code', () => {
			const error = new FileValidationError('Must be array', {
				meta: { code: 'invalid_array' },
			})

			expect(error.meta?.code).toBe('invalid_array')
		})

		it('should create error with empty_array code', () => {
			const error = new FileValidationError('Empty array', {
				meta: { code: 'empty_array', filePaths: [] },
			})

			expect(error.meta?.code).toBe('empty_array')
			expect(error.meta?.filePaths).toEqual([])
		})

		it('should create error with invalid_path code', () => {
			const error = new FileValidationError('Invalid path', {
				meta: { code: 'invalid_path', invalidPath: '/not/a/string' },
			})

			expect(error.meta?.code).toBe('invalid_path')
			expect(error.meta?.invalidPath).toBe('/not/a/string')
		})

		it('should create error with no_extension code', () => {
			const error = new FileValidationError('No extension', {
				meta: { code: 'no_extension', invalidPath: 'Contract' },
			})

			expect(error.meta?.code).toBe('no_extension')
			expect(error.meta?.invalidPath).toBe('Contract')
		})

		it('should create error with unsupported_extension code', () => {
			const error = new FileValidationError('Unsupported extension', {
				meta: { code: 'unsupported_extension', extension: '.txt' },
			})

			expect(error.meta?.code).toBe('unsupported_extension')
			expect(error.meta?.extension).toBe('.txt')
		})

		it('should create error with mixed_extensions code', () => {
			const error = new FileValidationError('Mixed extensions', {
				meta: { code: 'mixed_extensions', extensions: ['.sol', '.yul'] },
			})

			expect(error.meta?.code).toBe('mixed_extensions')
			expect(error.meta?.extensions).toEqual(['.sol', '.yul'])
		})

		it('should create error with extension_mismatch code', () => {
			const error = new FileValidationError('Extension mismatch', {
				meta: {
					code: 'extension_mismatch',
					language: 'Solidity',
					extension: '.yul',
					expectedExtension: '.sol',
				},
			})

			expect(error.meta?.code).toBe('extension_mismatch')
			expect(error.meta?.language).toBe('Solidity')
			expect(error.meta?.extension).toBe('.yul')
			expect(error.meta?.expectedExtension).toBe('.sol')
		})
	})

	describe('inheritance', () => {
		it('should be instance of Error', () => {
			const error = new FileValidationError('Test')
			expect(error).toBeInstanceOf(Error)
		})

		it('should be instance of FileValidationError', () => {
			const error = new FileValidationError('Test')
			expect(error).toBeInstanceOf(FileValidationError)
		})
	})

	describe('type guards', () => {
		it('should identify FileValidationError by instance', () => {
			const error = new FileValidationError('Test')
			expect(error instanceof FileValidationError).toBe(true)
		})

		it('should identify FileValidationError by name', () => {
			const error = new FileValidationError('Test')
			expect(error.name).toBe('FileValidationError')
		})

		it('should identify FileValidationError by tag', () => {
			const error = new FileValidationError('Test')
			expect(error._tag).toBe('FileValidationError')
		})
	})
})

describe('FileReadError', () => {
	describe('constructor', () => {
		it('should create error with message', () => {
			const error = new FileReadError('Failed to read file')

			expect(error).toBeInstanceOf(Error)
			expect(error.message).toBe('Failed to read file')
			expect(error.name).toBe('FileReadError')
			expect(error._tag).toBe('FileReadError')
		})

		it('should create error with cause', () => {
			const cause = new Error('ENOENT')
			const error = new FileReadError('Failed to read file', { cause })

			expect(error.cause).toBe(cause)
		})

		it('should create error with read_failed code', () => {
			const error = new FileReadError('Failed to read file', {
				meta: {
					code: 'read_failed',
					filePath: './Missing.sol',
					absolutePath: '/abs/path/Missing.sol',
				},
			})

			expect(error.meta?.code).toBe('read_failed')
			expect(error.meta?.filePath).toBe('./Missing.sol')
			expect(error.meta?.absolutePath).toBe('/abs/path/Missing.sol')
		})

		it('should create error with json_parse_failed code', () => {
			const error = new FileReadError('Failed to parse JSON', {
				meta: {
					code: 'json_parse_failed',
					filePath: './ast.json',
				},
			})

			expect(error.meta?.code).toBe('json_parse_failed')
			expect(error.meta?.filePath).toBe('./ast.json')
		})

		it('should create error without metadata', () => {
			const error = new FileReadError('Generic error')

			expect(error.meta).toBeUndefined()
		})
	})

	describe('inheritance', () => {
		it('should be instance of Error', () => {
			const error = new FileReadError('Test')
			expect(error).toBeInstanceOf(Error)
		})

		it('should be instance of FileReadError', () => {
			const error = new FileReadError('Test')
			expect(error).toBeInstanceOf(FileReadError)
		})
	})

	describe('type guards', () => {
		it('should identify FileReadError by instance', () => {
			const error = new FileReadError('Test')
			expect(error instanceof FileReadError).toBe(true)
		})

		it('should identify FileReadError by name', () => {
			const error = new FileReadError('Test')
			expect(error.name).toBe('FileReadError')
		})

		it('should identify FileReadError by tag', () => {
			const error = new FileReadError('Test')
			expect(error._tag).toBe('FileReadError')
		})
	})
})

describe('CompilerOutputError', () => {
	describe('constructor', () => {
		it('should create error with message', () => {
			const error = new CompilerOutputError('Compilation errors occurred')

			expect(error).toBeInstanceOf(Error)
			expect(error.message).toBe('Compilation errors occurred')
			expect(error.name).toBe('CompilerOutputError')
			expect(error._tag).toBe('CompilerOutputError')
		})

		it('should create error with cause', () => {
			const cause = new Error('Compiler failed')
			const error = new CompilerOutputError('Compilation errors occurred', { cause })

			expect(error.cause).toBe(cause)
		})

		it('should create error with compilation_errors code', () => {
			const errors = [
				{
					type: 'TypeError',
					component: 'general',
					severity: 'error',
					message: 'Type error',
					formattedMessage: 'Formatted message',
				},
			] as const satisfies SolcErrorEntry[]
			const error = new CompilerOutputError('Compilation errors occurred', {
				meta: { code: 'compilation_errors', errors },
			})

			expect(error.meta?.code).toBe('compilation_errors')
			expect(error.meta?.errors).toEqual(errors)
		})

		it('should create error with missing_source_output code', () => {
			const error = new CompilerOutputError('Missing source output', {
				meta: { code: 'missing_source_output' },
			})

			expect(error.meta?.code).toBe('missing_source_output')
		})

		it('should create error without metadata', () => {
			const error = new CompilerOutputError('Generic error')

			expect(error.meta).toBeUndefined()
		})
	})

	describe('inheritance', () => {
		it('should be instance of Error', () => {
			const error = new CompilerOutputError('Test')
			expect(error).toBeInstanceOf(Error)
		})

		it('should be instance of CompilerOutputError', () => {
			const error = new CompilerOutputError('Test')
			expect(error).toBeInstanceOf(CompilerOutputError)
		})
	})

	describe('type guards', () => {
		it('should identify CompilerOutputError by instance', () => {
			const error = new CompilerOutputError('Test')
			expect(error instanceof CompilerOutputError).toBe(true)
		})

		it('should identify CompilerOutputError by name', () => {
			const error = new CompilerOutputError('Test')
			expect(error.name).toBe('CompilerOutputError')
		})

		it('should identify CompilerOutputError by tag', () => {
			const error = new CompilerOutputError('Test')
			expect(error._tag).toBe('CompilerOutputError')
		})
	})
})

describe('AstParseError', () => {
	describe('constructor', () => {
		it('should create error with message', () => {
			const error = new AstParseError('Failed to parse AST')

			expect(error).toBeInstanceOf(Error)
			expect(error.message).toBe('Failed to parse AST')
			expect(error.name).toBe('AstParseError')
			expect(error._tag).toBe('AstParseError')
		})

		it('should create error with cause', () => {
			const cause = new Error('Parse failed')
			const error = new AstParseError('Failed to parse AST', { cause })

			expect(error.cause).toBe(cause)
		})

		it('should create error with parse_failed code', () => {
			const error = new AstParseError('Failed to parse AST', {
				meta: { code: 'parse_failed', sources: 'Contract.sol' },
			})

			expect(error.meta?.code).toBe('parse_failed')
			expect(error.meta?.sources).toBe('Contract.sol')
		})

		it('should create error with empty_ast code', () => {
			const error = new AstParseError('Empty AST', {
				meta: { code: 'empty_ast' },
			})

			expect(error.meta?.code).toBe('empty_ast')
		})

		it('should create error with invalid_source_ast code', () => {
			const error = new AstParseError('Invalid source AST', {
				meta: { code: 'invalid_source_ast', sources: 'Bad.sol' },
			})

			expect(error.meta?.code).toBe('invalid_source_ast')
			expect(error.meta?.sources).toBe('Bad.sol')
		})

		it('should create error with invalid_instrumented_ast code', () => {
			const error = new AstParseError('Invalid instrumented AST', {
				meta: { code: 'invalid_instrumented_ast' },
			})

			expect(error.meta?.code).toBe('invalid_instrumented_ast')
		})

		it('should create error without metadata', () => {
			const error = new AstParseError('Generic error')

			expect(error.meta).toBeUndefined()
		})
	})

	describe('inheritance', () => {
		it('should be instance of Error', () => {
			const error = new AstParseError('Test')
			expect(error).toBeInstanceOf(Error)
		})

		it('should be instance of AstParseError', () => {
			const error = new AstParseError('Test')
			expect(error).toBeInstanceOf(AstParseError)
		})
	})

	describe('type guards', () => {
		it('should identify AstParseError by instance', () => {
			const error = new AstParseError('Test')
			expect(error instanceof AstParseError).toBe(true)
		})

		it('should identify AstParseError by name', () => {
			const error = new AstParseError('Test')
			expect(error.name).toBe('AstParseError')
		})

		it('should identify AstParseError by tag', () => {
			const error = new AstParseError('Test')
			expect(error._tag).toBe('AstParseError')
		})
	})
})

describe('ShadowValidationError', () => {
	describe('constructor', () => {
		it('should create error with message', () => {
			const error = new ShadowValidationError('Invalid shadow options')

			expect(error).toBeInstanceOf(Error)
			expect(error.message).toBe('Invalid shadow options')
			expect(error.name).toBe('ShadowValidationError')
			expect(error._tag).toBe('ShadowValidationError')
		})

		it('should create error with cause', () => {
			const cause = new Error('Validation failed')
			const error = new ShadowValidationError('Invalid shadow options', { cause })

			expect(error.cause).toBe(cause)
		})

		it('should create error with invalid_shadow_language code', () => {
			const error = new ShadowValidationError('Invalid language', {
				meta: { code: 'invalid_shadow_language' },
			})

			expect(error.meta?.code).toBe('invalid_shadow_language')
		})

		it('should create error with missing_inject_path code', () => {
			const error = new ShadowValidationError('Missing inject path', {
				meta: {
					code: 'missing_inject_path',
					providedPath: undefined,
					sourceFilePaths: ['Contract1.sol', 'Contract2.sol'],
				},
			})

			expect(error.meta?.code).toBe('missing_inject_path')
			expect(error.meta?.providedPath).toBeUndefined()
			expect(error.meta?.sourceFilePaths).toEqual(['Contract1.sol', 'Contract2.sol'])
		})

		it('should create error with missing_inject_name code', () => {
			const error = new ShadowValidationError('Missing inject name', {
				meta: {
					code: 'missing_inject_name',
					providedName: undefined,
					sourceContractNames: ['Contract1', 'Contract2'],
				},
			})

			expect(error.meta?.code).toBe('missing_inject_name')
			expect(error.meta?.providedName).toBeUndefined()
			expect(error.meta?.sourceContractNames).toEqual(['Contract1', 'Contract2'])
		})

		it('should create error with missing_contract_files code', () => {
			const error = new ShadowValidationError('No contract files', {
				meta: { code: 'missing_contract_files' },
			})

			expect(error.meta?.code).toBe('missing_contract_files')
		})

		it('should create error with missing_contracts code', () => {
			const error = new ShadowValidationError('No contracts', {
				meta: { code: 'missing_contracts' },
			})

			expect(error.meta?.code).toBe('missing_contracts')
		})

		it('should create error with invalid_inject_path code', () => {
			const error = new ShadowValidationError('Invalid inject path', {
				meta: {
					code: 'invalid_inject_path',
					providedPath: 'Wrong.sol',
					sourceFilePaths: ['Contract1.sol', 'Contract2.sol'],
				},
			})

			expect(error.meta?.code).toBe('invalid_inject_path')
			expect(error.meta?.providedPath).toBe('Wrong.sol')
			expect(error.meta?.sourceFilePaths).toEqual(['Contract1.sol', 'Contract2.sol'])
		})

		it('should create error without metadata', () => {
			const error = new ShadowValidationError('Generic error')

			expect(error.meta).toBeUndefined()
		})
	})

	describe('inheritance', () => {
		it('should be instance of Error', () => {
			const error = new ShadowValidationError('Test')
			expect(error).toBeInstanceOf(Error)
		})

		it('should be instance of ShadowValidationError', () => {
			const error = new ShadowValidationError('Test')
			expect(error).toBeInstanceOf(ShadowValidationError)
		})
	})

	describe('type guards', () => {
		it('should identify ShadowValidationError by instance', () => {
			const error = new ShadowValidationError('Test')
			expect(error instanceof ShadowValidationError).toBe(true)
		})

		it('should identify ShadowValidationError by name', () => {
			const error = new ShadowValidationError('Test')
			expect(error.name).toBe('ShadowValidationError')
		})

		it('should identify ShadowValidationError by tag', () => {
			const error = new ShadowValidationError('Test')
			expect(error._tag).toBe('ShadowValidationError')
		})
	})
})

describe('NotSupportedError', () => {
	describe('constructor', () => {
		it('should create error with message', () => {
			const error = new NotSupportedError('Feature not supported')

			expect(error).toBeInstanceOf(Error)
			expect(error.message).toBe('Feature not supported')
			expect(error.name).toBe('NotSupportedError')
			expect(error._tag).toBe('NotSupportedError')
		})

		it('should create error with cause', () => {
			const cause = new Error('Not supported')
			const error = new NotSupportedError('Feature not supported', { cause })

			expect(error.cause).toBe(cause)
		})

		it('should create error with custom code', () => {
			const error = new NotSupportedError('Yul not supported', {
				meta: { code: 'yul_not_supported' },
			})

			expect(error.meta?.code).toBe('yul_not_supported')
		})

		it('should create error with multiple metadata fields', () => {
			const error = new NotSupportedError('Platform limitation', {
				meta: { code: 'platform_limitation' },
			})

			expect(error.meta?.code).toBe('platform_limitation')
		})

		it('should create error without metadata', () => {
			const error = new NotSupportedError('Generic error')

			expect(error.meta).toBeUndefined()
		})
	})

	describe('inheritance', () => {
		it('should be instance of Error', () => {
			const error = new NotSupportedError('Test')
			expect(error).toBeInstanceOf(Error)
		})

		it('should be instance of NotSupportedError', () => {
			const error = new NotSupportedError('Test')
			expect(error).toBeInstanceOf(NotSupportedError)
		})
	})

	describe('type guards', () => {
		it('should identify NotSupportedError by instance', () => {
			const error = new NotSupportedError('Test')
			expect(error instanceof NotSupportedError).toBe(true)
		})

		it('should identify NotSupportedError by name', () => {
			const error = new NotSupportedError('Test')
			expect(error.name).toBe('NotSupportedError')
		})

		it('should identify NotSupportedError by tag', () => {
			const error = new NotSupportedError('Test')
			expect(error._tag).toBe('NotSupportedError')
		})
	})
})

describe('Error class relationships', () => {
	it('should have unique error names', () => {
		const errors = [
			new VersionResolutionError('Test'),
			new SolcError('Test'),
			new FileValidationError('Test'),
			new FileReadError('Test'),
			new CompilerOutputError('Test'),
			new AstParseError('Test'),
			new ShadowValidationError('Test'),
			new NotSupportedError('Test'),
		]

		const names = errors.map((e) => e.name)
		const uniqueNames = new Set(names)

		expect(uniqueNames.size).toBe(names.length)
	})

	it('should have unique error tags', () => {
		const errors = [
			new VersionResolutionError('Test'),
			new SolcError('Test'),
			new FileValidationError('Test'),
			new FileReadError('Test'),
			new CompilerOutputError('Test'),
			new AstParseError('Test'),
			new ShadowValidationError('Test'),
			new NotSupportedError('Test'),
		]

		const tags = errors.map((e) => e._tag)
		const uniqueTags = new Set(tags)

		expect(uniqueTags.size).toBe(tags.length)
	})

	it('should all extend Error', () => {
		const errors = [
			new VersionResolutionError('Test'),
			new SolcError('Test'),
			new FileValidationError('Test'),
			new FileReadError('Test'),
			new CompilerOutputError('Test'),
			new AstParseError('Test'),
			new ShadowValidationError('Test'),
			new NotSupportedError('Test'),
		]

		errors.forEach((error) => {
			expect(error).toBeInstanceOf(Error)
		})
	})

	it('should not be instances of each other', () => {
		const versionError = new VersionResolutionError('Test')
		const solcError = new SolcError('Test')

		expect(versionError).not.toBeInstanceOf(SolcError)
		expect(solcError).not.toBeInstanceOf(VersionResolutionError)
	})
})

describe('Error stack traces', () => {
	it('should preserve stack traces', () => {
		const error = new VersionResolutionError('Test error')
		expect(error.stack).toBeDefined()
		expect(error.stack).toContain('VersionResolutionError')
		expect(error.stack).toContain('Test error')
	})

	it('should chain error causes in stack', () => {
		const cause = new Error('Root cause')
		const error = new SolcError('Wrapper error', { cause })

		expect(error.cause).toBe(cause)
		expect(error.stack).toBeDefined()
	})
})
