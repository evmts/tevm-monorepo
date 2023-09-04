import type { Logger, ModuleInfo } from '../types'
import { compileContractSync } from './compileContracts'
import { resolveArtifactsSync } from './resolveArtifactsSync'
import { type ResolvedConfig, defaultConfig } from '@evmts/config'
import {
	type MockedFunction,
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

vi.mock('./compileContracts', () => ({
	compileContractSync: vi.fn(),
}))

const mockModules: Record<string, ModuleInfo> = {
	module1: {
		id: 'id',
		rawCode: `import { TestContract } from 'module2'
contract TestContract {}`,
		code: `import { TestContract } from 'module2'
contract TestContract {}`,
		importedIds: ['module2'],
		resolutions: [
			{
				id: 'id',
				rawCode: 'contract TestContract2 {}',
				code: 'contract TestContract2 {}',
				importedIds: ['module2'],
				resolutions: [],
			},
		],
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
const config: ResolvedConfig = defaultConfig
const contracts = {
	Test: {
		abi: [],
		evm: {},
	},
}

const mockCompileContractSync = compileContractSync as MockedFunction<
	typeof compileContractSync
>

describe('resolveArtifactsSync', () => {
	it('should throw an error if the file is not a solidity file', () => {
		expect(() =>
			resolveArtifactsSync('test.txt', basedir, logger, config, false),
		).toThrowErrorMatchingInlineSnapshot('"Not a solidity file"')
	})

	it('should throw an error if the compilation failed', () => {
		// throw a compilation error
		mockCompileContractSync.mockImplementation(() => {
			throw new Error('Oops')
		})
		expect(() =>
			resolveArtifactsSync(solFile, basedir, logger, config, false),
		).toThrowErrorMatchingInlineSnapshot('"Oops"')
	})

	it('should return the contract artifacts', () => {
		mockCompileContractSync.mockReturnValue({
			artifacts: contracts,
			modules: mockModules,
		} as any)
		expect(
			resolveArtifactsSync(solFile, basedir, logger, config, false),
		).toMatchInlineSnapshot(`
			{
			  "artifacts": {
			    "Test": {
			      "abi": [],
			      "contractName": "Test",
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
			      "resolutions": [
			        {
			          "code": "contract TestContract2 {}",
			          "id": "id",
			          "importedIds": [
			            "module2",
			          ],
			          "rawCode": "contract TestContract2 {}",
			          "resolutions": [],
			        },
			      ],
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
		})

		const { artifacts } = resolveArtifactsSync(
			solFile,
			basedir,
			logger,
			config,
			false,
		)

		expect(artifacts).toEqual({
			Test: {
				contractName: 'Test',
				abi: ['testAbi'],
			},
		})
	})

	it('should throw an error if artifacts is undefined', () => {
		mockCompileContractSync.mockReturnValue({
			artifacts: undefined,
			modules: mockModules,
		})

		expect(() =>
			resolveArtifactsSync(solFile, basedir, logger, config, false),
		).toThrowErrorMatchingInlineSnapshot('"Compilation failed"')
	})
})

afterEach(() => {
	vi.clearAllMocks()
})
