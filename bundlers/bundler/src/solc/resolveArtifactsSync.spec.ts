import { Logger } from '../types'
import { compileContractSync } from './compileContracts'
import { resolveArtifactsSync } from './resolveArtifactsSync'
import { ResolvedConfig, defaultConfig } from '@evmts/config'
import { Mock, afterEach, describe, expect, it, vi } from 'vitest'

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
const expectedArtifacts = {
	Test: { contractName: 'Test', abi: [], bytecode: '0x123' },
}

const mockCompileContractSync = compileContractSync as Mock

describe('resolveArtifactsSync', () => {
	it('should throw an error if the file is not a solidity file', () => {
		expect(() =>
			resolveArtifactsSync('test.txt', basedir, logger, config),
		).toThrow('Not a solidity file')
	})

	it('should throw an error if the compilation failed', () => {
		mockCompileContractSync.mockReturnValue(null)
		expect(() =>
			resolveArtifactsSync(solFile, basedir, logger, config),
		).toThrow('Compilation failed')
		expect(logger.error).toBeCalledWith(`Compilation failed for ${solFile}`)
	})

	it('should return the contract artifacts', () => {
		mockCompileContractSync.mockReturnValue(contracts)
		expect(resolveArtifactsSync(solFile, basedir, logger, config)).toEqual(
			expectedArtifacts,
		)
	})
})

afterEach(() => {
	vi.clearAllMocks()
})
