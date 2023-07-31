import { getScriptSnapshotDecorator } from '.'
import { Logger } from '../factories'
import { EvmtsConfig, defaultConfig, defineConfig } from '@evmts/config'
import path from 'path'
import typescript from 'typescript/lib/tsserverlibrary'
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest'

const forgeProject = path.join(__dirname, '../..')

const { remappings, ...compilerOptions } = defaultConfig.compiler
const mockConfig: EvmtsConfig = {
	...defaultConfig,
	compiler: {
		...compilerOptions,
		solcVersion: '0.8.0',
	},
}
const config = defineConfig(() => mockConfig).configFn('.')

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
		const decorator = getScriptSnapshotDecorator(
			{ languageServiceHost, project } as any,
			typescript,
			logger,
			config,
		)
		const fileName = 'foo.ts'
		const result = decorator.getScriptSnapshot(fileName)
		expect(result).toEqual(expectedReturn)
		expect(languageServiceHost.getScriptSnapshot).toHaveBeenCalledWith(fileName)
	})

	it('should return the .ts file if it exists', () => {
		const decorator = getScriptSnapshotDecorator(
			{ languageServiceHost, project } as any,
			typescript,
			logger,
			config,
		)
		const fileName = path.join(__dirname, '../test/fixtures/HelloWorld3.sol')
		decorator.getScriptSnapshot(fileName)
		expect(languageServiceHost.getScriptSnapshot).toHaveBeenCalledWith(
			path.join(__dirname, '../test/fixtures/HelloWorld3.sol'),
		)
	})
	it('should return the .d.ts file if it exists', () => {
		const decorator = getScriptSnapshotDecorator(
			{ languageServiceHost, project } as any,
			typescript,
			logger,
			config,
		)
		const fileName = path.join(__dirname, '../test/fixtures/HelloWorld.sol')
		decorator.getScriptSnapshot(fileName)
		expect(languageServiceHost.getScriptSnapshot).toHaveBeenCalledWith(
			path.join(__dirname, '../test/fixtures/HelloWorld.sol'),
		)
	})
	it('should return a generated .d.ts file for solidity files', () => {
		const decorator = getScriptSnapshotDecorator(
			{ languageServiceHost, project } as any,
			typescript,
			logger,
			config,
		)
		const fileName = path.join(__dirname, '../test/fixtures/HelloWorld2.sol')
		const result = decorator.getScriptSnapshot(fileName)
		expect((result as any).text).toMatchInlineSnapshot(`
			"import { EvmtsContract } from '@evmts/core'
			const _abiHelloWorld = [{\\"inputs\\":[],\\"name\\":\\"greet\\",\\"outputs\\":[{\\"internalType\\":\\"string\\",\\"name\\":\\"\\",\\"type\\":\\"string\\"}],\\"stateMutability\\":\\"pure\\",\\"type\\":\\"function\\"}] as const;
			const _chainAddressMapHelloWorld = {} as const;
			const _nameHelloWorld = \\"HelloWorld\\" as const;
			/**
			 * HelloWorld EvmtsContract
			 */
			export const HelloWorld: EvmtsContract<typeof _nameHelloWorld, typeof _chainAddressMapHelloWorld, typeof _abiHelloWorld>;
			const _abiHelloWorld2 = [{\\"inputs\\":[],\\"name\\":\\"greet2\\",\\"outputs\\":[{\\"internalType\\":\\"string\\",\\"name\\":\\"\\",\\"type\\":\\"string\\"}],\\"stateMutability\\":\\"pure\\",\\"type\\":\\"function\\"}] as const;
			const _chainAddressMapHelloWorld2 = {} as const;
			const _nameHelloWorld2 = \\"HelloWorld2\\" as const;
			/**
			 * HelloWorld2 EvmtsContract
			 */
			export const HelloWorld2: EvmtsContract<typeof _nameHelloWorld2, typeof _chainAddressMapHelloWorld2, typeof _abiHelloWorld2>;"
		`)
	})
	it('should handle resolveDts throwing', () => {
		const decorator = getScriptSnapshotDecorator(
			{ languageServiceHost, project } as any,
			typescript,
			logger,
			config,
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
