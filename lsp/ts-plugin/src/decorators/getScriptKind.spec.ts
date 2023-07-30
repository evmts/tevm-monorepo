import { getScriptKindDecorator } from '.'
import { EvmtsConfig, defaultConfig, defineConfig } from '@evmts/config'
import typescript from 'typescript/lib/tsserverlibrary'
import { beforeEach, describe, expect, it, vi } from 'vitest'

type TestAny = any

const { remappings, ...compilerOptions } = defaultConfig.compiler

const mockConfig: EvmtsConfig = {
	...defaultConfig,
	compiler: {
		...compilerOptions,
		solcVersion: '0.8.0',
	},
}
const config = defineConfig(() => mockConfig).configFn('.')

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
			getScriptKindDecorator(createInfo, typescript, logger, config)
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
		)
		expect(decorated.getScriptKind?.('foo')).toBe(typescript.ScriptKind.Unknown)
	})

	it('Should return TS if file is solidity', () => {
		const decorated = getScriptKindDecorator(
			createInfo,
			typescript,
			logger,
			config,
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
