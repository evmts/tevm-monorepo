import { compileContractSync } from './compiler/compileContractsSync.js'
import { resolveArtifactsSync } from './resolveArtifactsSync.js'
import type { FileAccessObject, Logger, ModuleInfo } from './types.js'
import { type ResolvedCompilerConfig, defaultConfig } from '@evmts/config'
import {
	type MockedFunction,
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

vi.mock('./compiler/compileContractsSync', () => ({
	compileContractSync: vi.fn(),
}))

const fao: FileAccessObject = {
	existsSync: vi.fn() as any,
	readFileSync: vi.fn() as any,
	readFile: vi.fn() as any,
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

const mockCompileContractSync = compileContractSync as MockedFunction<
	typeof compileContractSync
>

describe('resolveArtifactsSync', () => {
	it('should throw an error if the file is not a solidity file', () => {
		expect(() =>
			resolveArtifactsSync(
				'test.txt',
				basedir,
				logger,
				config,
				false,
				false,
				fao,
			),
		).toThrowErrorMatchingInlineSnapshot('"Not a solidity file"')
	})

	it('should throw an error if the compilation failed', () => {
		// throw a compilation error
		mockCompileContractSync.mockImplementation(() => {
			throw new Error('Oops')
		})
		expect(() =>
			resolveArtifactsSync(solFile, basedir, logger, config, false, false, fao),
		).toThrowErrorMatchingInlineSnapshot('"Oops"')
	})

	it('should return the contract artifacts', () => {
		mockCompileContractSync.mockReturnValue({
			artifacts: contracts,
			modules: mockModules,
		} as any)
		expect(
			resolveArtifactsSync(solFile, basedir, logger, config, false, false, fao),
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

		const { artifacts } = resolveArtifactsSync(
			solFile,
			basedir,
			logger,
			config,
			false,
			false,
			fao,
		)

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
			resolveArtifactsSync(solFile, basedir, logger, config, false, false, fao),
		).toThrowErrorMatchingInlineSnapshot('"Compilation failed"')
	})

	it('should throw an error if file doesnt end in .sol', () => {
		expect(() =>
			resolveArtifactsSync(
				'test.txt',
				basedir,
				logger,
				config,
				false,
				false,
				fao,
			),
		).toThrowErrorMatchingInlineSnapshot('"Not a solidity file"')
	})
})

afterEach(() => {
	vi.clearAllMocks()
})
