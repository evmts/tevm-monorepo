import type { FileAccessObject, Logger, ModuleInfo } from '../types'
import { compileContractSync } from './compileContracts'
import { resolveArtifacts } from './resolveArtifacts'
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
const config: ResolvedConfig = defaultConfig
const contracts = {
	Test: {
		abi: [],
		evm: { bytecode: { object: '0x123' } },
	},
}
const mockCompileContractSync = compileContractSync as MockedFunction<
	typeof compileContractSync
>

describe('resolveArtifacts', () => {
	it('should return the contract artifacts', async () => {
		mockCompileContractSync.mockReturnValue({
			artifacts: contracts,
			modules: {} as Record<string, ModuleInfo>,
		} as any)
		expect(
			await resolveArtifacts(solFile, basedir, logger, config, false, fao),
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
			  "modules": {},
			  "solcInput": undefined,
			  "solcOutput": undefined,
			}
		`)
	})
})

afterEach(() => {
	vi.clearAllMocks()
})
