import { getScriptSnapshotDecorator } from '.'
import { Config, Logger } from '../factories'
import path from 'path'
import typescript from 'typescript/lib/tsserverlibrary'
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest'

const forgeProject = path.join(__dirname, '../..')

const config: Config = {
	name: '@evmts/ts-plugin',
	project: '.',
	out: 'artifacts',
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
			"import type { EVMtsContract } from '@evmts/core'
			const _abi = [{\\"inputs\\":[],\\"name\\":\\"greet\\",\\"outputs\\":[{\\"internalType\\":\\"string\\",\\"name\\":\\"\\",\\"type\\":\\"string\\"}],\\"stateMutability\\":\\"pure\\",\\"type\\":\\"function\\"}] as const
			/**
			 * HelloWorld EVMtsContract
			 * @etherscan 1 https://etherscan.io/address/undefined
			 */
			export const HelloWorld: EVMtsContract<HelloWorld, \\"undefined\\", typeof _abi>
			const _abi = [{\\"inputs\\":[],\\"name\\":\\"greet2\\",\\"outputs\\":[{\\"internalType\\":\\"string\\",\\"name\\":\\"\\",\\"type\\":\\"string\\"}],\\"stateMutability\\":\\"pure\\",\\"type\\":\\"function\\"}] as const
			/**
			 * HelloWorld2 EVMtsContract
			 * @etherscan 1 https://etherscan.io/address/undefined
			 */
			export const HelloWorld2: EVMtsContract<HelloWorld2, \\"undefined\\", typeof _abi>"
		`)
	})
})
