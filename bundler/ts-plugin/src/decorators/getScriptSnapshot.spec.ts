import { Logger } from '../factories/logger.js'
import { getScriptSnapshotDecorator } from './getScriptSnapshot.js'
import { FileAccessObject } from '@evmts/base'
import { CompilerConfig, defaultConfig, defineConfig } from '@evmts/config'
import { runSync } from 'effect/Effect'
import { existsSync, readFileSync } from 'fs'
import { readFile } from 'fs/promises'
import path from 'path'
import typescript from 'typescript/lib/tsserverlibrary.js'
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest'

const forgeProject = path.join(__dirname, '../..')

const { remappings, ...compilerOptions } = defaultConfig
const mockConfig: CompilerConfig = {
	...defaultConfig,
	...compilerOptions,
}
const config = runSync(defineConfig(() => mockConfig).configFn('.'))

const fao: FileAccessObject = {
	readFile,
	readFileSync,
	existsSync,
}

describe(getScriptSnapshotDecorator.name, () => {
	let logger: Logger
	let languageServiceHost: {
		getScriptSnapshot: Mock
	}

	let project = {
		getCurrentDirectory: vi.fn(),
	}
	beforeEach(() => {
		logger = {
			info: vi.fn(),
			error: vi.fn(),
			warn: vi.fn(),
			log: vi.fn(),
		}
		project = {
			getCurrentDirectory: vi.fn(),
		}
		project.getCurrentDirectory.mockReturnValue(forgeProject)
		languageServiceHost = {
			getScriptSnapshot: vi.fn(),
		}
	})

	it('should proxy to the languageServiceHost for non solidity files', () => {
		const expectedReturn = `
    export type Foo = string
    `
		languageServiceHost.getScriptSnapshot.mockReturnValue(expectedReturn)
		const decorator = getScriptSnapshotDecorator()(
			{ languageServiceHost, project } as any,
			typescript,
			logger,
			config,
			fao,
		)
		const fileName = 'foo.ts'
		const result = decorator.getScriptSnapshot(fileName)
		expect(result).toEqual(expectedReturn)
		expect(languageServiceHost.getScriptSnapshot).toHaveBeenCalledWith(fileName)
	})

	it('should return the .ts file if it exists', () => {
		const decorator = getScriptSnapshotDecorator()(
			{ languageServiceHost, project } as any,
			typescript,
			logger,
			config,
			fao,
		)
		const fileName = path.join(__dirname, '../test/fixtures/HelloWorld3.sol')
		decorator.getScriptSnapshot(fileName)
		expect(languageServiceHost.getScriptSnapshot).toHaveBeenCalledWith(
			path.join(__dirname, '../test/fixtures/HelloWorld3.sol'),
		)
	})
	it('should return the .d.ts file if it exists', () => {
		const decorator = getScriptSnapshotDecorator()(
			{ languageServiceHost, project } as any,
			typescript,
			logger,
			config,
			fao,
		)
		const fileName = path.join(__dirname, '../test/fixtures/HelloWorld.sol')
		decorator.getScriptSnapshot(fileName)
		expect(languageServiceHost.getScriptSnapshot).toHaveBeenCalledWith(
			path.join(__dirname, '../test/fixtures/HelloWorld.sol'),
		)
	})
	it('should return a generated .d.ts file for solidity files', () => {
		const decorator = getScriptSnapshotDecorator()(
			{ languageServiceHost, project } as any,
			typescript,
			logger,
			config,
			fao,
		)
		const fileName = path.join(__dirname, '../test/fixtures/HelloWorld2.sol')
		const result = decorator.getScriptSnapshot(fileName)
		expect((result as any).text).toMatchInlineSnapshot(`
			"import { EvmtsContract } from '@evmts/core'
			const _abiHelloWorld = [\\"function greet() pure returns (string)\\"] as const;
			const _nameHelloWorld = \\"HelloWorld\\" as const;
			/**
			 * HelloWorld EvmtsContract
			 */
			export const HelloWorld: EvmtsContract<typeof _nameHelloWorld, typeof _abiHelloWorld, undefined, undefined>;
			const _abiHelloWorld2 = [\\"function greet2() pure returns (string)\\"] as const;
			const _nameHelloWorld2 = \\"HelloWorld2\\" as const;
			/**
			 * HelloWorld2 EvmtsContract
			 */
			export const HelloWorld2: EvmtsContract<typeof _nameHelloWorld2, typeof _abiHelloWorld2, undefined, undefined>;"
		`)
	})
	it('should handle resolveDts throwing', () => {
		const decorator = getScriptSnapshotDecorator()(
			{ languageServiceHost, project } as any,
			typescript,
			logger,
			config,
			fao,
		)
		const fileName = path.join(__dirname, '../test/fixtures/BadCompile.sol')
		const result = decorator.getScriptSnapshot(fileName)
		expect(result).toMatchInlineSnapshot(`
			StringScriptSnapshot {
			  "text": "export {}",
			}
		`)
	})
})
