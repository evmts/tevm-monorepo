import { access, mkdir, stat, writeFile } from 'node:fs/promises'
import type { FileAccessObject } from '@tevm/base-bundler'
import { type CompilerConfig, defaultConfig, defineConfig } from '@tevm/config'
import { runSync } from 'effect/Effect'
import typescript from 'typescript/lib/tsserverlibrary.js'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getScriptKindDecorator } from './getScriptKind.js'

type TestAny = any

const { remappings, ...compilerOptions } = defaultConfig

const mockConfig: CompilerConfig = {
	...defaultConfig,
	...compilerOptions,
}
const config = runSync(defineConfig(() => mockConfig).configFn('.'))

const fao: FileAccessObject = {
	readFile: vi.fn(),
	readFileSync: vi.fn(),
	existsSync: vi.fn(),
	writeFileSync: vi.fn(),
	statSync: vi.fn() as any,
	stat,
	mkdirSync: vi.fn(),
	mkdir,
	writeFile,
	exists: async (path: string) => {
		try {
			await access(path)
			return true
		} catch (e) {
			return false
		}
	},
}

describe(getScriptKindDecorator.name, () => {
	let createInfo: TestAny
	let logger: TestAny

	beforeEach(() => {
		createInfo = {
			languageServiceHost: {
				getScriptKind: vi.fn(),
			},
		}
		logger = {
			log: vi.fn(),
			info: vi.fn(),
			warn: vi.fn(),
			error: vi.fn(),
		}
	})

	it('should decorate getScriptKind', () => {
		expect(getScriptKindDecorator(createInfo, typescript, logger, config, fao).getScriptKind).toBeInstanceOf(Function)
	})

	it('Should return unknown if no getScriptKind on language host', () => {
		createInfo.languageServiceHost.getScriptKind = undefined
		const logger = {
			log: vi.fn(),
			info: vi.fn(),
			warn: vi.fn(),
			error: vi.fn(),
		}
		const decorated = getScriptKindDecorator(createInfo, typescript, logger, config, fao)
		expect(decorated.getScriptKind?.('foo')).toBe(typescript.ScriptKind.Unknown)
	})

	it('Should return TS if file is solidity', () => {
		const decorated = getScriptKindDecorator(createInfo, typescript, logger, config, fao)
		expect(decorated.getScriptKind?.('foo.sol')).toBe(typescript.ScriptKind.External)
		expect(decorated.getScriptKind?.('./foo.sol')).toBe(typescript.ScriptKind.TS)
	})

	it('Should proxy to languageServiceHost.getScriptKind if not solidity', () => {
		const decorated = getScriptKindDecorator(createInfo, typescript, logger, config, fao)
		const expected = typescript.ScriptKind.JS
		createInfo.languageServiceHost.getScriptKind.mockReturnValue(expected)
		const fileNames = ['foo.js', 'foo.sol.js', 'sol.js', '.sol.js', 'sol.sol.sol.sol.js']
		fileNames.forEach((fileName) => {
			expect(decorated.getScriptKind?.(fileName)).toBe(expected)
			expect(createInfo.languageServiceHost.getScriptKind).toHaveBeenLastCalledWith(fileName)
		})
	})

	it('Should handle parent directory relative paths correctly', () => {
		const decorated = getScriptKindDecorator(createInfo, typescript, logger, config, fao)
		// Test with different levels of parent directory navigation
		expect(decorated.getScriptKind?.('../Contract.sol')).toBe(typescript.ScriptKind.TS)
		expect(decorated.getScriptKind?.('../../deeper/path/Contract.sol')).toBe(typescript.ScriptKind.TS)
		
		// Ensure non-solidity files with parent paths are proxied
		createInfo.languageServiceHost.getScriptKind.mockReturnValue(typescript.ScriptKind.JS)
		expect(decorated.getScriptKind?.('../Contract.js')).toBe(typescript.ScriptKind.JS)
		expect(createInfo.languageServiceHost.getScriptKind).toHaveBeenLastCalledWith('../Contract.js')
	})

	it('Should handle edge cases with invalid solidity paths', () => {
		const decorated = getScriptKindDecorator(createInfo, typescript, logger, config, fao)
		createInfo.languageServiceHost.getScriptKind.mockReturnValue(typescript.ScriptKind.Unknown)
		
		// These are not valid Solidity paths according to isSolidity implementation
		const invalidSolidityPaths = ['.sol', '/.sol']
		
		invalidSolidityPaths.forEach(path => {
			expect(decorated.getScriptKind?.(path)).toBe(typescript.ScriptKind.Unknown)
			expect(createInfo.languageServiceHost.getScriptKind).toHaveBeenLastCalledWith(path)
		})
		
		// Even if they're relative paths, they shouldn't be treated as Solidity files
		expect(decorated.getScriptKind?.('./.sol')).toBe(typescript.ScriptKind.Unknown)
		expect(createInfo.languageServiceHost.getScriptKind).toHaveBeenLastCalledWith('./.sol')
	})
})
