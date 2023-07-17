import { bundler } from './bundler'
import { resolveArtifacts, resolveArtifactsSync } from './solc'
import { Bundler, ModuleInfo } from './types'
import { Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

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
		vi.mock('./solc', () => {
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
			mockResolveArtifacts.mockResolvedValueOnce({})
			const result = await resolver.resolveDts('module', 'basedir')
			expect(result).toMatchInlineSnapshot(`
				{
				  "code": "",
				  "modules": undefined,
				}
			`)
		})

		it('should generate proper dts if artifacts are found', async () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [], bytecode: '' },
			}
			mockResolveArtifacts.mockResolvedValueOnce({
				artifacts,
				modules: mockModules,
			})
			const result = await resolver.resolveDts('module', 'basedir')
			expect(result).toMatchInlineSnapshot(`
				{
				  "code": "import type { EvmtsContract } from '@evmts/core'
				type _AbiTestContract = [] as const;
				type _ChainAddressMapTestContract = {\\"name\\":\\"TestContract\\",\\"addresses\\":{}} as const;
				type _NameTestContract = \\"TestContract\\";
				/**
				 * TestContract EvmtsContract
				 */
				export const TestContract: EvmtsContract<_NameTestContract, _ChainAddressMapTestContract, _AbiTestContract>;",
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
				}
			`)
		})
	})

	const mockResolveArtifactsSync = resolveArtifactsSync as Mock
	describe('resolveDtsSync', () => {
		it('should return an empty string if no artifacts are found', () => {
			mockResolveArtifactsSync.mockReturnValueOnce({})
			const result = resolver.resolveDtsSync('module', 'basedir')
			expect(result).toMatchInlineSnapshot(`
				{
				  "code": "",
				  "modules": undefined,
				}
			`)
		})

		it('should generate proper dts if artifacts are found', () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [], bytecode: '' },
			}
			mockResolveArtifactsSync.mockReturnValueOnce({
				artifacts,
				modules: mockModules,
			})
			const result = resolver.resolveDtsSync('module', 'basedir')
			expect(result).toMatchInlineSnapshot(`
				{
				  "code": "import type { EvmtsContract } from '@evmts/core'
				type _AbiTestContract = [] as const;
				type _ChainAddressMapTestContract = {} as const;
				type _NameTestContract = \\"TestContract\\";
				/**
				 * TestContract EvmtsContract
				 */
				export const TestContract: EvmtsContract<_NameTestContract, _ChainAddressMapTestContract, _AbiTestContract>;",
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
				}
			`)
		})
	})

	describe('resolveTsModuleSync', () => {
		it('should return an empty string if no artifacts are found', () => {
			mockResolveArtifactsSync.mockReturnValueOnce({})
			const result = resolver.resolveTsModuleSync('module', 'basedir')
			expect(result).toMatchInlineSnapshot(`
				{
				  "code": "",
				  "modules": undefined,
				}
			`)
		})

		it('should generate proper dts if artifacts are found', () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [], bytecode: '' },
			}
			;(resolveArtifactsSync as Mock).mockReturnValueOnce({
				artifacts,
				modules: mockModules,
			})
			const result = resolver.resolveTsModuleSync('module', 'basedir')
			expect(result).toMatchInlineSnapshot(`
				{
				  "code": "import { evmtsContractFactory } from '@evmts/core'
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"abi\\":[],\\"bytecode\\":\\"\\",\\"addresses\\":{}} as const
				export const TestContract = evmtsContractFactory(_TestContract)",
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
				}
			`)
		})
	})

	describe('resolveTsModule', () => {
		it('should return an empty string if no artifacts are found', async () => {
			mockResolveArtifacts.mockResolvedValueOnce({})
			const result = await resolver.resolveTsModule('module', 'basedir')
			expect(result).toMatchInlineSnapshot(`
				{
				  "code": "",
				  "modules": undefined,
				}
			`)
		})

		it('should generate proper dts if artifacts are found', async () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [], bytecode: '' },
			}
			mockResolveArtifacts.mockResolvedValueOnce({
				artifacts,
				modules: mockModules,
			})
			const result = await resolver.resolveTsModule('module', 'basedir')
			expect(result).toMatchInlineSnapshot(`
				{
				  "code": "import { evmtsContractFactory } from '@evmts/core'
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"abi\\":[],\\"bytecode\\":\\"\\",\\"addresses\\":{}} as const
				export const TestContract = evmtsContractFactory(_TestContract)",
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
				}
			`)
		})
	})

	describe('resolveCjsModuleSync', () => {
		it('should return an empty string if no artifacts are found', () => {
			mockResolveArtifactsSync.mockReturnValueOnce({})
			const result = resolver.resolveCjsModuleSync('module', 'basedir')
			expect(result).toMatchInlineSnapshot(`
				{
				  "code": "",
				  "modules": undefined,
				}
			`)
		})

		it('should generate proper CommonJS module if artifacts are found', () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [], bytecode: '' },
			}
			mockResolveArtifactsSync.mockReturnValueOnce({
				artifacts,
				modules: mockModules,
			})
			const result = resolver.resolveCjsModuleSync('module', 'basedir')
			expect(result).toMatchInlineSnapshot(`
				{
				  "code": "const { evmtsContractFactory } = require('@evmts/core')
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"abi\\":[],\\"bytecode\\":\\"\\",\\"addresses\\":{}}
				module.exports.TestContract = evmtsContractFactory(_TestContract)",
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
				}
			`)
		})
	})

	describe('resolveCjsModule', () => {
		it('should return an empty string if no artifacts are found', async () => {
			mockResolveArtifacts.mockResolvedValueOnce({})
			const result = await resolver.resolveCjsModule('module', 'basedir')
			expect(result).toMatchInlineSnapshot(`
				{
				  "code": "",
				  "modules": undefined,
				}
			`)
		})

		it('should generate proper CommonJS module if artifacts are found', async () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [], bytecode: '' },
			}
			mockResolveArtifacts.mockResolvedValueOnce({
				artifacts,
				modules: mockModules,
			})
			const result = await resolver.resolveCjsModule('module', 'basedir')
			expect(result).toMatchInlineSnapshot(`
				{
				  "code": "const { evmtsContractFactory } = require('@evmts/core')
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"abi\\":[],\\"bytecode\\":\\"\\",\\"addresses\\":{}}
				module.exports.TestContract = evmtsContractFactory(_TestContract)",
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
				}
			`)
		})
	})

	describe('resolveEsmModuleSync', () => {
		it('should return an empty string if no artifacts are found', () => {
			mockResolveArtifactsSync.mockReturnValueOnce({})
			const result = resolver.resolveEsmModuleSync('module', 'basedir')
			expect(result).toMatchInlineSnapshot(`
				{
				  "code": "",
				  "modules": undefined,
				}
			`)
		})

		it('should generate proper ESM module if artifacts are found', () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [], bytecode: '' },
			}
			mockResolveArtifactsSync.mockReturnValueOnce({
				artifacts,
				modules: mockModules,
			})
			const result = resolver.resolveEsmModuleSync('module', 'basedir')
			expect(result).toMatchInlineSnapshot(`
				{
				  "code": "import { evmtsContractFactory } from '@evmts/core'
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"abi\\":[],\\"bytecode\\":\\"\\",\\"addresses\\":{}}
				export const TestContract = evmtsContractFactory(_TestContract)",
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
				}
			`)
		})
	})

	describe('resolveEsmModule', () => {
		it('should return an empty string if no artifacts are found', async () => {
			mockResolveArtifacts.mockResolvedValueOnce({})
			const result = await resolver.resolveEsmModule('module', 'basedir')
			expect(result).toMatchInlineSnapshot(`
				{
				  "code": "",
				  "modules": undefined,
				}
			`)
		})

		it('should generate proper ESM module if artifacts are found', async () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [], bytecode: '' },
			}
			mockResolveArtifacts.mockResolvedValueOnce({
				artifacts,
				modules: mockModules,
			})
			const result = await resolver.resolveEsmModule('module', 'basedir')
			expect(result).toMatchInlineSnapshot(`
				{
				  "code": "import { evmtsContractFactory } from '@evmts/core'
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"abi\\":[],\\"bytecode\\":\\"\\",\\"addresses\\":{}}
				export const TestContract = evmtsContractFactory(_TestContract)",
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
				}
			`)
		})
	})
})
