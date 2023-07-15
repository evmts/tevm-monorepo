import { Bundler } from '../types'
import { bundler } from './bundler'
import { resolveArtifacts, resolveArtifactsSync } from './resolveArtifacts'
import { Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe(bundler.name, () => {
	let resolver: ReturnType<Bundler>
	let logger
	let config

	beforeEach(() => {
		logger = { ...console, error: vi.fn() }
		config = {
			compiler: 'compiler config',
			localContracts: { contracts: [{ name: 'TestContract', addresses: {} }] },
		}

		resolver = bundler(config as any, logger)
		vi.mock('./resolveArtifacts', () => {
			return {
				resolveArtifacts: vi.fn(),
				resolveArtifactsSync: vi.fn(),
			}
		})
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	const mockResolveArtifacts = resolveArtifacts as Mock
	describe('resolveDts', () => {
		it('should return an empty string if no artifacts are found', async () => {
			mockResolveArtifacts.mockResolvedValueOnce(undefined)
			const result = await resolver.resolveDts('module', 'basedir')
			expect(result).toBe('')
		})

		it('should generate proper dts if artifacts are found', async () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [], bytecode: '' },
			}
			mockResolveArtifacts.mockResolvedValueOnce(artifacts)
			const result = await resolver.resolveDts('module', 'basedir')
			expect(result).toMatchInlineSnapshot(`
				"import type { EVMtsContract } from '@evmts/core'
				const _abiTestContract = [] as const
				const _chainAddressMapTestContract = {\\"name\\":\\"TestContract\\",\\"addresses\\":{}} as const
				/**
				 * TestContract EVMtsContract
				 */
				export const TestContract: EVMtsContract<TestContract, typeof _chainAddressMapTestContract, typeof _abiTestContract>"
			`)
		})
	})

	const mockResolveArtifactsSync = resolveArtifactsSync as Mock
	describe('resolveDtsSync', () => {
		it('should return an empty string if no artifacts are found', () => {
			mockResolveArtifactsSync.mockReturnValueOnce(undefined)
			const result = resolver.resolveDtsSync('module', 'basedir')
			expect(result).toBe('')
		})

		it('should generate proper dts if artifacts are found', () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [], bytecode: '' },
			}
			mockResolveArtifactsSync.mockReturnValueOnce(artifacts)
			const result = resolver.resolveDtsSync('module', 'basedir')
			expect(result).toMatchInlineSnapshot(`
				"import type { EVMtsContract } from '@evmts/core'
				const _abiTestContract = [] as const
				const _chainAddressMapTestContract = {} as const
				/**
				 * TestContract EVMtsContract
				 */
				export const TestContract: EVMtsContract<TestContract, typeof _chainAddressMapTestContract, typeof _abiTestContract>"
			`)
		})
	})

	describe('resolveTsModuleSync', () => {
		it('should return an empty string if no artifacts are found', () => {
			mockResolveArtifactsSync.mockReturnValueOnce(undefined)
			const result = resolver.resolveTsModuleSync('module', 'basedir')
			expect(result).toBe('')
		})

		it('should generate proper dts if artifacts are found', () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [], bytecode: '' },
			}
			;(resolveArtifactsSync as Mock).mockReturnValueOnce(artifacts)
			const result = resolver.resolveTsModuleSync('module', 'basedir')
			expect(result).toMatchInlineSnapshot(`
				"import { evmtsContractFactory } from '@evmts/core'
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"abi\\":[],\\"bytecode\\":\\"\\",\\"addresses\\":{}} as const
				export const TestContract = evmtsContractFactory(_TestContract)"
			`)
		})
	})

	describe('resolveTsModule', () => {
		it('should return an empty string if no artifacts are found', async () => {
			mockResolveArtifacts.mockResolvedValueOnce(undefined)
			const result = await resolver.resolveTsModule('module', 'basedir')
			expect(result).toBe('')
		})

		it('should generate proper dts if artifacts are found', async () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [], bytecode: '' },
			}
			mockResolveArtifacts.mockResolvedValueOnce(artifacts)
			const result = await resolver.resolveTsModule('module', 'basedir')
			expect(result).toMatchInlineSnapshot(`
				"import { evmtsContractFactory } from '@evmts/core'
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"abi\\":[],\\"bytecode\\":\\"\\",\\"addresses\\":{}} as const
				export const TestContract = evmtsContractFactory(_TestContract)"
			`)
		})
	})

	describe('resolveCjsModuleSync', () => {
		it('should return an empty string if no artifacts are found', () => {
			mockResolveArtifactsSync.mockReturnValueOnce(undefined)
			const result = resolver.resolveCjsModuleSync('module', 'basedir')
			expect(result).toBe('')
		})

		it('should generate proper CommonJS module if artifacts are found', () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [], bytecode: '' },
			}
			mockResolveArtifactsSync.mockReturnValueOnce(artifacts)
			const result = resolver.resolveCjsModuleSync('module', 'basedir')
			expect(result).toMatchInlineSnapshot(`
				"const { evmtsContractFactory } = require('@evmts/core')
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"abi\\":[],\\"bytecode\\":\\"\\",\\"addresses\\":{}}
				module.exports.TestContract = evmtsContractFactory(_TestContract)"
			`)
		})
	})

	describe('resolveCjsModule', () => {
		it('should return an empty string if no artifacts are found', async () => {
			mockResolveArtifacts.mockResolvedValueOnce(undefined)
			const result = await resolver.resolveCjsModule('module', 'basedir')
			expect(result).toBe('')
		})

		it('should generate proper CommonJS module if artifacts are found', async () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [], bytecode: '' },
			}
			mockResolveArtifacts.mockResolvedValueOnce(artifacts)
			const result = await resolver.resolveCjsModule('module', 'basedir')
			expect(result).toMatchInlineSnapshot(`
				"const { evmtsContractFactory } = require('@evmts/core')
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"abi\\":[],\\"bytecode\\":\\"\\",\\"addresses\\":{}}
				module.exports.TestContract = evmtsContractFactory(_TestContract)"
			`)
		})
	})

	describe('resolveEsmModuleSync', () => {
		it('should return an empty string if no artifacts are found', () => {
			mockResolveArtifactsSync.mockReturnValueOnce(undefined)
			const result = resolver.resolveEsmModuleSync('module', 'basedir')
			expect(result).toBe('')
		})

		it('should generate proper ESM module if artifacts are found', () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [], bytecode: '' },
			}
			mockResolveArtifactsSync.mockReturnValueOnce(artifacts)
			const result = resolver.resolveEsmModuleSync('module', 'basedir')
			expect(result).toMatchInlineSnapshot(`
				"import { evmtsContractFactory } from '@evmts/core'
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"abi\\":[],\\"bytecode\\":\\"\\",\\"addresses\\":{}}
				export const TestContract = evmtsContractFactory(_TestContract)"
			`)
		})
	})

	describe('resolveEsmModule', () => {
		it('should return an empty string if no artifacts are found', async () => {
			mockResolveArtifacts.mockResolvedValueOnce(undefined)
			const result = await resolver.resolveEsmModule('module', 'basedir')
			expect(result).toBe('')
		})

		it('should generate proper ESM module if artifacts are found', async () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [], bytecode: '' },
			}
			mockResolveArtifacts.mockResolvedValueOnce(artifacts)
			const result = await resolver.resolveEsmModule('module', 'basedir')
			expect(result).toMatchInlineSnapshot(`
				"import { evmtsContractFactory } from '@evmts/core'
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"abi\\":[],\\"bytecode\\":\\"\\",\\"addresses\\":{}}
				export const TestContract = evmtsContractFactory(_TestContract)"
			`)
		})
	})
})
