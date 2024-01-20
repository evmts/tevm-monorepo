import { Logger } from '../factories/logger.js'
import { getScriptSnapshotDecorator } from './getScriptSnapshot.js'
import { FileAccessObject } from '@tevm/base-bundler'
import { Cache, createCache } from '@tevm/bundler-cache'
import { CompilerConfig, defaultConfig, defineConfig } from '@tevm/config'
import { runSync } from 'effect/Effect'
import {
	existsSync,
	mkdirSync,
	readFileSync,
	statSync,
	writeFileSync,
} from 'fs'
import { access, mkdir, readFile, stat, writeFile } from 'fs/promises'
import { tmpdir } from 'os'
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
	writeFileSync,
	statSync,
	stat,
	mkdirSync,
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

describe(getScriptSnapshotDecorator.name, () => {
	let logger: Logger
	let languageServiceHost: {
		getScriptSnapshot: Mock
	}

	let project = {
		getCurrentDirectory: vi.fn(),
	}

	let cache: Cache

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
		cache = createCache(tmpdir(), fao, tmpdir())
	})

	it('should proxy to the languageServiceHost for non solidity files', () => {
		const expectedReturn = `
    export type Foo = string
    `
		languageServiceHost.getScriptSnapshot.mockReturnValue(expectedReturn)
		const decorator = getScriptSnapshotDecorator(cache)(
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
		const decorator = getScriptSnapshotDecorator(cache)(
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
		const decorator = getScriptSnapshotDecorator(cache)(
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
		const decorator = getScriptSnapshotDecorator(cache)(
			{ languageServiceHost, project } as any,
			typescript,
			logger,
			config,
			fao,
		)
		const fileName = path.join(__dirname, '../test/fixtures/HelloWorld2.sol')
		const result = decorator.getScriptSnapshot(fileName)
		expect((result as any).text).toMatchInlineSnapshot(`
			"import { Contract } from '@tevm/contract'
			const _abiHelloWorld = [\\"function greet() pure returns (string)\\"] as const;
			const _nameHelloWorld = \\"HelloWorld\\" as const;
			/**
			 * HelloWorld Contract
			 */
			export const HelloWorld: Contract<typeof _nameHelloWorld, typeof _abiHelloWorld>;
			const _abiHelloWorld2 = [\\"function greet2() pure returns (string)\\"] as const;
			const _nameHelloWorld2 = \\"HelloWorld2\\" as const;
			/**
			 * HelloWorld2 Contract
			 */
			export const HelloWorld2: Contract<typeof _nameHelloWorld2, typeof _abiHelloWorld2>;"
		`)
	})
	it('should handle resolveDts throwing', () => {
		const decorator = getScriptSnapshotDecorator(cache)(
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
