import { getScriptSnapshotDecorator } from '.'
import { Logger } from '../factories'
import { defaultConfig, defineConfig } from '@evmts/config'
import path from 'path'
import typescript from 'typescript/lib/tsserverlibrary'
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest'

const forgeProject = path.join(__dirname, '../..')

const config = defineConfig(() => defaultConfig).configFn('.')

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

	it('should return a generated .d.ts file for solidity files', () => {
		const decorator = getScriptSnapshotDecorator(
			{ languageServiceHost, project } as any,
			typescript,
			logger,
			config,
		)
		const fileName = path.join(__dirname, '../test/fixtures/HelloWorld.sol')
		const result = decorator.getScriptSnapshot(fileName)
		expect((result as any).text).toMatchInlineSnapshot(`
			"import type { EvmtsContract } from '@evmts/core'
			type _AbiHelloWorld = [{\\"inputs\\":[],\\"name\\":\\"greet\\",\\"outputs\\":[{\\"internalType\\":\\"string\\",\\"name\\":\\"\\",\\"type\\":\\"string\\"}],\\"stateMutability\\":\\"pure\\",\\"type\\":\\"function\\"}] as const;
			type _ChainAddressMapHelloWorld = {} as const;
			type _NameHelloWorld = \\"HelloWorld\\";
			/**
			 * HelloWorld EvmtsContract
			 */
			export const HelloWorld: EvmtsContract<_NameHelloWorld, _ChainAddressMapHelloWorld, _AbiHelloWorld>;
			type _AbiHelloWorld2 = [{\\"inputs\\":[],\\"name\\":\\"greet2\\",\\"outputs\\":[{\\"internalType\\":\\"string\\",\\"name\\":\\"\\",\\"type\\":\\"string\\"}],\\"stateMutability\\":\\"pure\\",\\"type\\":\\"function\\"}] as const;
			type _ChainAddressMapHelloWorld2 = {} as const;
			type _NameHelloWorld2 = \\"HelloWorld2\\";
			/**
			 * HelloWorld2 EvmtsContract
			 */
			export const HelloWorld2: EvmtsContract<_NameHelloWorld2, _ChainAddressMapHelloWorld2, _AbiHelloWorld2>;"
		`)
	})
})
