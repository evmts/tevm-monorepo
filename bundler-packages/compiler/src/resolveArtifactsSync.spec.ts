import { defaultConfig, type ResolvedCompilerConfig } from '@tevm/config'
import { afterEach, beforeEach, describe, expect, it, type MockedFunction, vi } from 'vitest'
import { compileContractSync } from './compiler/compileContractsSync.js'
import { resolveArtifactsSync } from './resolveArtifactsSync.js'
import type { FileAccessObject, Logger, ModuleInfo, SolcInputDescription, SolcOutput } from './types.js'

vi.mock('./compiler/compileContractsSync', () => ({
	compileContractSync: vi.fn(),
}))

const fao: FileAccessObject = {
	existsSync: vi.fn() as any,
	readFileSync: vi.fn() as any,
	readFile: vi.fn() as any,
	exists: vi.fn() as any,
}

const mockModules: Record<string, ModuleInfo> = {
	module1: {
		id: 'id',
		rawCode: `import { TestContract } from 'module2'
contract TestContract {}`,
		code: `import { TestContract } from 'module2'
contract TestContract {}`,
		importedIds: ['module2'],
	},
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
		evm: {},
	},
}

const mockCompileContractSync = compileContractSync as MockedFunction<typeof compileContractSync>

describe('resolveArtifactsSync', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should throw an error if the file is not a solidity file', () => {
		expect(() =>
			resolveArtifactsSync('test.txt', basedir, logger, config, false, false, fao, require('solc')),
		).toThrowErrorMatchingInlineSnapshot('[Error: Not a solidity file]')
	})

	it('should throw an error if the compilation failed', () => {
		// throw a compilation error
		mockCompileContractSync.mockImplementation(() => {
			throw new Error('Oops')
		})
		expect(() =>
			resolveArtifactsSync(solFile, basedir, logger, config, false, false, fao, require('solc')),
		).toThrowErrorMatchingInlineSnapshot('[Error: Oops]')
	})

	it('should return the contract artifacts', () => {
		mockCompileContractSync.mockReturnValue({
			artifacts: contracts,
			modules: mockModules,
		} as any)
		expect(
			resolveArtifactsSync(solFile, basedir, logger, config, false, false, fao, require('solc')),
		).toMatchInlineSnapshot(`
			{
			  "artifacts": {
			    "Test": {
			      "abi": [],
			      "contractName": "Test",
			      "evm": {},
			      "userdoc": undefined,
			    },
			  },
			  "asts": undefined,
			  "modules": {
			    "module1": {
			      "code": "import { TestContract } from 'module2'
			contract TestContract {}",
			      "id": "id",
			      "importedIds": [
			        "module2",
			      ],
			      "rawCode": "import { TestContract } from 'module2'
			contract TestContract {}",
			    },
			  },
			  "solcInput": undefined,
			  "solcOutput": undefined,
			}
		`)
	})

	it('should correctly transform the contract artifacts', () => {
		mockCompileContractSync.mockReturnValue({
			artifacts: {
				Test: {
					abi: ['testAbi'] as any,
					evm: { bytecode: { object: 'testBytecode' } } as any,
				},
			} as any,
			modules: mockModules,
		} as any)

		const { artifacts } = resolveArtifactsSync(solFile, basedir, logger, config, false, false, fao, require('solc'))

		expect(artifacts).toEqual({
			Test: {
				contractName: 'Test',
				abi: ['testAbi'],
				evm: { bytecode: { object: 'testBytecode' } },
			},
		})
	})

	it('should throw an error if artifacts is undefined', () => {
		mockCompileContractSync.mockReturnValue({
			artifacts: undefined,
			modules: mockModules,
		} as any)

		expect(() =>
			resolveArtifactsSync(solFile, basedir, logger, config, false, false, fao, require('solc')),
		).toThrowErrorMatchingInlineSnapshot('[Error: Compilation failed]')
	})

	it('should throw an error if file doesnt end in .sol', () => {
		expect(() =>
			resolveArtifactsSync('test.txt', basedir, logger, config, false, false, fao, require('solc')),
		).toThrowErrorMatchingInlineSnapshot('[Error: Not a solidity file]')
	})

	it('should correctly transform complex artifact structures', () => {
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

		mockCompileContractSync.mockReturnValue({
			artifacts: complexContracts,
			modules: mockModules,
			solcInput: mockSolcInput,
			solcOutput: mockSolcOutput,
		} as any)

		const result = resolveArtifactsSync(solFile, basedir, logger, config, false, true, fao, require('solc'))

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

	it('should handle artifacts with ASTs correctly', () => {
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

		mockCompileContractSync.mockReturnValue({
			artifacts: contracts,
			modules: mockModules,
			asts: { 'test.sol': mockAst },
			solcInput: {} as SolcInputDescription,
			solcOutput: {} as SolcOutput,
		} as any)

		const result = resolveArtifactsSync(solFile, basedir, logger, config, true, false, fao, require('solc'))

		expect(result.asts).toBeDefined()
		expect(result.asts?.['test.sol']).toEqual(mockAst)
	})

	it('should handle compiler errors by propagating them', () => {
		mockCompileContractSync.mockImplementation(() => {
			throw new Error('Compilation error: invalid syntax')
		})

		expect(() => resolveArtifactsSync(solFile, basedir, logger, config, false, false, fao, require('solc'))).toThrow(
			'Compilation error: invalid syntax',
		)

		expect(mockCompileContractSync).toHaveBeenCalledWith(
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

	it('should log error message before throwing if compilation fails', () => {
		mockCompileContractSync.mockReturnValue({
			artifacts: undefined,
			modules: mockModules,
		} as any)

		expect(() => resolveArtifactsSync(solFile, basedir, logger, config, false, false, fao, require('solc'))).toThrow(
			'Compilation failed',
		)

		expect(logger.error).toHaveBeenCalledWith(`Compilation failed for ${solFile}`)
	})

	it('should handle multi-contract compilation and return all artifacts', () => {
		const multiContractArtifacts = {
			Contract1: {
				abi: [{ name: 'function1', type: 'function' }],
				evm: { bytecode: { object: '0x123' } },
			},
			Contract2: {
				abi: [{ name: 'function2', type: 'function' }],
				evm: { bytecode: { object: '0x456' } },
			},
		}

		mockCompileContractSync.mockReturnValue({
			artifacts: multiContractArtifacts,
			modules: mockModules,
		} as any)

		const result = resolveArtifactsSync(solFile, basedir, logger, config, false, false, fao, require('solc'))

		expect(Object.keys(result.artifacts)).toHaveLength(2)
		if ('Contract1' in result.artifacts) {
			expect(result.artifacts['Contract1']).toBeDefined()
		}
		if ('Contract2' in result.artifacts) {
			expect(result.artifacts['Contract2']).toBeDefined()
		}
		if ('Contract1' in result.artifacts && result.artifacts['Contract1']) {
			expect(result.artifacts['Contract1'].abi).toEqual([{ name: 'function1', type: 'function' }])
		}
		if ('Contract2' in result.artifacts && result.artifacts['Contract2']) {
			expect(result.artifacts['Contract2'].abi).toEqual([{ name: 'function2', type: 'function' }])
		}
	})

	it('should verify the contractName is added to each artifact', () => {
		const namedArtifacts = {
			NamedContract: {
				abi: [],
				evm: {},
			},
		}

		mockCompileContractSync.mockReturnValue({
			artifacts: namedArtifacts,
			modules: mockModules,
		} as any)

		const result = resolveArtifactsSync(solFile, basedir, logger, config, false, false, fao, require('solc'))

		if ('NamedContract' in result.artifacts) {
			expect(result.artifacts['NamedContract'].contractName).toBe('NamedContract')
		}
	})
})

afterEach(() => {
	vi.clearAllMocks()
})
