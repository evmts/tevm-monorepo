import { compileContract } from './compiler/compileContracts.js'
import { resolveArtifacts } from './resolveArtifacts.js'
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

vi.mock('./compiler/compileContracts', () => ({
	compileContract: vi.fn(),
}))

const fao: FileAccessObject = {
	existsSync: vi.fn() as any,
	readFile: vi.fn() as any,
	readFileSync: vi.fn() as any,
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
const mockCompileContract = compileContract as MockedFunction<
	typeof compileContract
>

describe('resolveArtifacts', () => {
	it('should return the contract artifacts', async () => {
		mockCompileContract.mockReturnValue({
			artifacts: contracts,
			modules: {} as Record<string, ModuleInfo>,
		} as any)
		expect(
			await resolveArtifacts(
				solFile,
				basedir,
				logger,
				config,
				false,
				false,
				fao,
			),
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

	it('should throw an error if the solidity file does not end in .sol', () => {
		expect(() =>
			resolveArtifacts('test', basedir, logger, config, false, false, fao),
		).rejects.toThrowErrorMatchingInlineSnapshot('"Not a solidity file"')
	})

	it('should throw an error if no artifacts are returned by the compiler', () => {
		mockCompileContract.mockReturnValue({
			artifacts: undefined,
			modules: {} as Record<string, ModuleInfo>,
		} as any)
		expect(() =>
			resolveArtifacts(solFile, basedir, logger, config, false, false, fao),
		).rejects.toThrowErrorMatchingInlineSnapshot('"Compilation failed"')
	})
})

afterEach(() => {
	vi.clearAllMocks()
})
