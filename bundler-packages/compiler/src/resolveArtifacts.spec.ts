import { defaultConfig, type ResolvedCompilerConfig } from '@tevm/config'
import { afterEach, beforeEach, describe, expect, it, type MockedFunction, vi } from 'vitest'
import { compileContract } from './compiler/compileContracts.js'
import { resolveArtifacts } from './resolveArtifacts.js'
import type { FileAccessObject, Logger, ModuleInfo, SolcInputDescription, SolcOutput } from './types.js'

vi.mock('./compiler/compileContracts', () => ({
	compileContract: vi.fn(),
}))

const fao: FileAccessObject = {
	existsSync: vi.fn() as any,
	readFile: vi.fn() as any,
	readFileSync: vi.fn() as any,
	exists: vi.fn() as any,
}

const solFile = 'test.sol'
const basedir = 'basedir'
const logger: Logger = {
	info: vi.fn(),
	error: vi.fn(),
	warn: vi.fn(),
	log: vi.fn(),
}
const config: ResolvedCompilerConfig = defaultConfig
const contracts = {
	Test: {
		abi: [],
		evm: { bytecode: { object: '0x123' } },
	},
}

const mockCompileContract = compileContract as MockedFunction<typeof compileContract>

describe('resolveArtifacts', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should return the contract artifacts', async () => {
		mockCompileContract.mockReturnValue({
			artifacts: contracts,
			modules: {} as Record<string, ModuleInfo>,
		} as any)
		expect(
			await resolveArtifacts(solFile, basedir, logger, config, false, false, fao, require('solc')),
		).toMatchInlineSnapshot(`
			{
			  "artifacts": {
			    "Test": {
			      "abi": [],
			      "contractName": "Test",
			      "evm": {
			        "bytecode": {
			          "object": "0x123",
			        },
			      },
			      "userdoc": undefined,
			    },
			  },
			  "asts": undefined,
			  "modules": {},
			  "solcInput": undefined,
			  "solcOutput": undefined,
			}
		`)
	})

	it('should throw an error if the solidity file does not end in .sol', async () => {
		await expect(() =>
			resolveArtifacts('test', basedir, logger, config, false, false, fao, require('solc')),
		).rejects.toThrowErrorMatchingInlineSnapshot('[Error: Not a solidity file]')
	})

	it('should throw an error if no artifacts are returned by the compiler', async () => {
		mockCompileContract.mockReturnValue({
			artifacts: undefined,
			modules: {} as Record<string, ModuleInfo>,
		} as any)
		await expect(() =>
			resolveArtifacts(solFile, basedir, logger, config, false, false, fao, require('solc')),
		).rejects.toThrowErrorMatchingInlineSnapshot('[Error: Compilation failed]')
	})

	it('should correctly transform complex artifact structures', async () => {
		const complexContracts = {
			ComplexContract: {
				abi: [
					{
						inputs: [],
						name: 'getValue',
						outputs: [{ name: '', type: 'uint256' }],
						stateMutability: 'view',
						type: 'function',
					},
					{
						inputs: [{ name: '_value', type: 'uint256' }],
						name: 'setValue',
						outputs: [],
						stateMutability: 'nonpayable',
						type: 'function',
					},
				],
				userdoc: {
					methods: {
						'getValue()': {
							notice: 'Returns the current value',
						},
						'setValue(uint256)': {
							notice: 'Sets a new value',
						},
					},
				},
				evm: {
					bytecode: {
						object:
							'0x608060405234801561001057600080fd5b5060f78061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c806317a889c514603757806355241077146053575b600080fd5b603d607e565b6040518082815260200191505060405180910390f35b607c60048036036020811015606757600080fd5b81019080803590602001909291905050506084565b005b60005481565b806000819055505056fea2646970667358221220223b76',
					},
					deployedBytecode: {
						object:
							'0x6080604052348015600f57600080fd5b506004361060325760003560e01c806317a889c514603757806355241077146053575b600080fd5b603d607e565b6040518082815260200191505060405180910390f35b607c60048036036020811015606757600080fd5b81019080803590602001909291905050506084565b005b60005481565b806000819055505056fea2646970667358221220223b76',
					},
				},
			},
		}

		const mockModules = {
			'test.sol': {
				id: 'test.sol',
				code: 'contract ComplexContract { uint value; function getValue() public view returns (uint) { return value; } function setValue(uint _value) public { value = _value; } }',
				importedIds: [],
			},
		}

		const mockSolcInput = {
			language: 'Solidity',
			sources: {
				'test.sol': {
					content:
						'contract ComplexContract { uint value; function getValue() public view returns (uint) { return value; } function setValue(uint _value) public { value = _value; } }',
				},
			},
			settings: {
				outputSelection: {
					'*': {
						'*': ['abi', 'userdoc', 'evm.bytecode.object', 'evm.deployedBytecode.object'],
					},
				},
			},
		} as SolcInputDescription

		// @ts-expect-error - This is a mock for testing purposes
		const mockSolcOutput = {
			contracts: {
				'test.sol': complexContracts,
			},
			sources: {},
		} as SolcOutput

		mockCompileContract.mockReturnValue({
			artifacts: complexContracts,
			modules: mockModules,
			solcInput: mockSolcInput,
			solcOutput: mockSolcOutput,
		} as any)

		const result = await resolveArtifacts(solFile, basedir, logger, config, false, true, fao, require('solc'))

		expect(result.artifacts).toBeDefined()
		if ('ComplexContract' in result.artifacts) {
			const contract = result.artifacts['ComplexContract']
			expect(contract).toBeDefined()
			if (contract) {
				expect(contract.abi).toHaveLength(2)
				expect(contract.userdoc).toBeDefined()
				if (contract.userdoc) {
					expect(contract.userdoc.methods).toBeDefined()
				}
				if (contract.evm?.bytecode) {
					expect(contract.evm.bytecode.object).toBeDefined()
				}
			}
		}
		expect(result.solcInput).toEqual(mockSolcInput)
		expect(result.solcOutput).toEqual(mockSolcOutput)
	})

	it('should handle artifacts with ASTs correctly', async () => {
		const mockAst = {
			nodeType: 'SourceUnit',
			absolutePath: 'test.sol',
			nodes: [
				{
					nodeType: 'ContractDefinition',
					name: 'TestContract',
					baseContracts: [],
					contractDependencies: [],
					contractKind: 'contract',
					fullyImplemented: true,
				},
			],
		}

		mockCompileContract.mockReturnValue({
			artifacts: contracts,
			modules: {} as Record<string, ModuleInfo>,
			asts: { 'test.sol': mockAst },
			solcInput: {} as SolcInputDescription,
			solcOutput: {} as SolcOutput,
		} as any)

		const result = await resolveArtifacts(solFile, basedir, logger, config, true, false, fao, require('solc'))

		expect(result.asts).toBeDefined()
		expect(result.asts?.['test.sol']).toEqual(mockAst)
	})

	it('should handle compiler errors by propagating them', async () => {
		mockCompileContract.mockImplementation(() => {
			throw new Error('Compilation error: invalid syntax')
		})

		await expect(
			resolveArtifacts(solFile, basedir, logger, config, false, false, fao, require('solc')),
		).rejects.toThrow('Compilation error: invalid syntax')

		expect(mockCompileContract).toHaveBeenCalledWith(
			solFile,
			basedir,
			config,
			false,
			false,
			fao,
			logger,
			require('solc'),
		)
	})

	it('should log error message before throwing if compilation fails', async () => {
		mockCompileContract.mockReturnValue({
			artifacts: undefined,
			modules: {} as Record<string, ModuleInfo>,
		} as any)

		await expect(
			resolveArtifacts(solFile, basedir, logger, config, false, false, fao, require('solc')),
		).rejects.toThrow('Compilation failed')

		expect(logger.error).toHaveBeenCalledWith(`Compilation failed for ${solFile}`)
	})
})

afterEach(() => {
	vi.clearAllMocks()
})
