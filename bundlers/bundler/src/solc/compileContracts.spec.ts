import type { ModuleInfo } from '../types'
import { compileContractSync } from './compileContracts'
import { moduleFactory } from './moduleFactory'
import { ResolvedConfig } from '@evmts/config'
import { readFileSync } from 'fs'
import * as resolve from 'resolve'
// TODO wrap this in a typesafe version
// @ts-ignore
import solc from 'solc'
import { Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the necessary functions and modules
vi.mock('fs', () => ({ readFileSync: vi.fn() }))
vi.mock('resolve', () => ({ sync: vi.fn() }))
vi.mock('solc', () => {
	const defaultExport = { compile: vi.fn() }
	return { default: defaultExport, ...defaultExport }
})
vi.mock('./moduleFactory', () => ({ moduleFactory: vi.fn() }))

describe('compileContractSync', () => {
	const filePath = 'test/path'
	const basedir = 'base/dir'
	const config: ResolvedConfig['compiler'] = {
		foundryProject: 'forge',
		solcVersion: '4.2.0',
		remappings: { 'key1/': '/path/to/key1', 'key2/': '/path/to/key2' },
		libs: ['lib1', 'lib2'],
	}
	const mockSource = ['import ./resolutionFile.sol', 'contract Test {}'].join(
		'\n',
	)
	const mockResolution: ModuleInfo = {
		id: 'test/path/resolutionFile.sol',
		code: 'contract Resolution {}',
		importedIds: [],
		resolutions: [],
		rawCode: 'contract Resolution {}',
	}
	const mockModule: ModuleInfo = {
		rawCode: mockSource,
		id: filePath,
		code: mockSource.replace(
			'./resolutionFile.sol',
			'test/path/resolutionFile.sol',
		),
		importedIds: ['./importedId'],
		resolutions: [mockResolution],
	}
	const mockCompiledContract = {
		Test: { abi: [], evm: { bytecode: { object: '0x123' } } },
	}

	const mockReadFileSync = readFileSync as Mock
	const mockResolveSync = resolve.sync as Mock
	const mockModuleFactory = moduleFactory as Mock
	const mockSolcCompile = solc.compile as Mock
	beforeEach(() => {
		mockReadFileSync.mockReturnValue(mockSource)
		mockResolveSync.mockReturnValue(filePath)
		mockModuleFactory.mockReturnValue(mockModule)
		mockSolcCompile.mockReturnValue(
			JSON.stringify({
				contracts: { [filePath]: mockCompiledContract },
				errors: [],
			}),
		)
	})

	it('should compile a contract correctly', () => {
		const compiledContract = compileContractSync(filePath, basedir, config)

		expect(compiledContract).toEqual(mockCompiledContract)
		expect(readFileSync).toBeCalledWith(filePath, 'utf8')
		expect(resolve.sync).toBeCalledWith(filePath, { basedir })
		expect(moduleFactory).toBeCalledWith(
			filePath,
			mockSource,
			config.remappings,
			config.libs,
		)
		expect((solc.compile as Mock).mock.lastCall).toMatchInlineSnapshot(`
			[
			  "{\\"language\\":\\"Solidity\\",\\"sources\\":{\\"test/path\\":{\\"content\\":\\"import test/path/resolutionFile.sol\\\\ncontract Test {}\\"},\\"test/path/resolutionFile.sol\\":{\\"content\\":\\"contract Resolution {}\\"}},\\"settings\\":{\\"outputSelection\\":{\\"*\\":{\\"*\\":[\\"*\\"]}}}}",
			]
		`)
	})

	afterEach(() => {
		vi.clearAllMocks()
	})
})
