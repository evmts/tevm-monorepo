import { getScriptKindDecorator } from './getScriptKind.js'
import { FileAccessObject } from '@evmts/base'
import { CompilerConfig, defaultConfig, defineConfig } from '@evmts/config'
import { runSync } from 'effect/Effect'
import typescript from 'typescript/lib/tsserverlibrary.js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

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
		expect(
			getScriptKindDecorator(createInfo, typescript, logger, config, fao)
				.getScriptKind,
		).toBeInstanceOf(Function)
	})

	it('Should return unknown if no getScriptKind on language host', () => {
		createInfo.languageServiceHost.getScriptKind = undefined
		const logger = {
			log: vi.fn(),
			info: vi.fn(),
			warn: vi.fn(),
			error: vi.fn(),
		}
		const decorated = getScriptKindDecorator(
			createInfo,
			typescript,
			logger,
			config,
			fao,
		)
		expect(decorated.getScriptKind?.('foo')).toBe(typescript.ScriptKind.Unknown)
	})

	it('Should return TS if file is solidity', () => {
		const decorated = getScriptKindDecorator(
			createInfo,
			typescript,
			logger,
			config,
			fao,
		)
		expect(decorated.getScriptKind?.('foo.sol')).toBe(typescript.ScriptKind.TS)
		expect(decorated.getScriptKind?.('./foo.sol')).toBe(
			typescript.ScriptKind.TS,
		)
	})

	it('Should proxy to languageServiceHost.getScriptKind if not solidity', () => {
		const decorated = getScriptKindDecorator(
			createInfo,
			typescript,
			logger,
			config,
			fao,
		)
		const expected = typescript.ScriptKind.JS
		createInfo.languageServiceHost.getScriptKind.mockReturnValue(expected)
		const fileNames = [
			'foo.js',
			'foo.sol.js',
			'sol.js',
			'.sol.js',
			'sol.sol.sol.sol.js',
		]
		fileNames.forEach((fileName) => {
			expect(decorated.getScriptKind?.(fileName)).toBe(expected)
			expect(
				createInfo.languageServiceHost.getScriptKind,
			).toHaveBeenLastCalledWith(fileName)
		})
	})
})
