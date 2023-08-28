import { type ResolvedConfig, defaultConfig } from '@evmts/config'
import {
	type MockedFunction,
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import type { Logger, ModuleInfo } from '../types'
import { compileContractSync } from './compileContracts'
import { resolveArtifacts } from './resolveArtifacts'

vi.mock('./compileContracts', () => ({
	compileContractSync: vi.fn(),
}))

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
			await resolveArtifacts(solFile, basedir, logger, config, false),
		).toMatchInlineSnapshot(`
			{
			  "artifacts": {
			    "Test": {
			      "abi": [],
			      "contractName": "Test",
			      "userdoc": undefined,
			    },
			  },
			  "modules": {},
			}
		`)
	})
})

afterEach(() => {
	vi.clearAllMocks()
})
