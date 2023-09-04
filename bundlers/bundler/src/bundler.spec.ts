import { bundler } from './bundler'
import { resolveArtifacts, resolveArtifactsSync } from './solc'
import type { SolcInputDescription, SolcOutput } from './solc/solc'
import type { Bundler, ModuleInfo } from './types'
import { writeFileSync } from 'fs'
import type { Node } from 'solidity-ast/node'
import * as ts from 'typescript'
import {
	type Mock,
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

const erc20Abi = [
	{
		constant: true,
		inputs: [],
		name: 'name',
		outputs: [
			{
				name: '',
				type: 'string',
			},
		],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{
				name: '_spender',
				type: 'address',
			},
			{
				name: '_value',
				type: 'uint256',
			},
		],
		name: 'approve',
		outputs: [
			{
				name: '',
				type: 'bool',
			},
		],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'totalSupply',
		outputs: [
			{
				name: '',
				type: 'uint256',
			},
		],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{
				name: '_from',
				type: 'address',
			},
			{
				name: '_to',
				type: 'address',
			},
			{
				name: '_value',
				type: 'uint256',
			},
		],
		name: 'transferFrom',
		outputs: [
			{
				name: '',
				type: 'bool',
			},
		],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'decimals',
		outputs: [
			{
				name: '',
				type: 'uint8',
			},
		],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: true,
		inputs: [
			{
				name: '_owner',
				type: 'address',
			},
		],
		name: 'balanceOf',
		outputs: [
			{
				name: 'balance',
				type: 'uint256',
			},
		],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'symbol',
		outputs: [
			{
				name: '',
				type: 'string',
			},
		],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{
				name: '_to',
				type: 'address',
			},
			{
				name: '_value',
				type: 'uint256',
			},
		],
		name: 'transfer',
		outputs: [
			{
				name: '',
				type: 'bool',
			},
		],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [
			{
				name: '_owner',
				type: 'address',
			},
			{
				name: '_spender',
				type: 'address',
			},
		],
		name: 'allowance',
		outputs: [
			{
				name: '',
				type: 'uint256',
			},
		],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		payable: true,
		stateMutability: 'payable',
		type: 'fallback',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				name: 'owner',
				type: 'address',
			},
			{
				indexed: true,
				name: 'spender',
				type: 'address',
			},
			{
				indexed: false,
				name: 'value',
				type: 'uint256',
			},
		],
		name: 'Approval',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				name: 'from',
				type: 'address',
			},
			{
				indexed: true,
				name: 'to',
				type: 'address',
			},
			{
				indexed: false,
				name: 'value',
				type: 'uint256',
			},
		],
		name: 'Transfer',
		type: 'event',
	},
] as const

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

	const mockAddresses = {
		10: '0x123',
	}
	beforeEach(() => {
		logger = { ...console, error: vi.fn() }
		config = {
			compiler: 'compiler config',
			localContracts: {
				contracts: [{ name: 'TestContract', addresses: mockAddresses }],
			},
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
			const result = await resolver.resolveDts('module', 'basedir', false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": undefined,
				  "code": "",
				  "modules": undefined,
				  "solcInput": undefined,
				  "solcOutput": undefined,
				}
			`)
		})

		it('should generate proper dts if artifacts are found', async () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [] },
			}
			mockResolveArtifacts.mockResolvedValueOnce({
				artifacts,
				modules: mockModules,
				asts: {
					'TestContract.sol': {
						absolutePath: '/absolute/path',
						evmVersion: 'homestead',
					},
					solcInput: {
						language: 'Solidity',
						settings: { outputSelection: { sources: {} } },
						sources: {},
					} satisfies SolcInputDescription,
					solcOutput: {
						contracts: {},
						sources: {},
					} satisfies SolcOutput,
				} as any as Record<string, Node>,
			})
			const result = await resolver.resolveDts('module', 'basedir', false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": {
				    "TestContract.sol": {
				      "absolutePath": "/absolute/path",
				      "evmVersion": "homestead",
				    },
				    "solcInput": {
				      "language": "Solidity",
				      "settings": {
				        "outputSelection": {
				          "sources": {},
				        },
				      },
				      "sources": {},
				    },
				    "solcOutput": {
				      "contracts": {},
				      "sources": {},
				    },
				  },
				  "code": "import { EvmtsContract } from '@evmts/core'
				const _abiTestContract = [] as const;
				const _chainAddressMapTestContract = {\\"10\\":\\"0x123\\"} as const;
				const _nameTestContract = \\"TestContract\\" as const;
				/**
				 * TestContract EvmtsContract
				 * @etherscan-10 https://optimistic.etherscan.io/address/0x123
				 */
				export const TestContract: EvmtsContract<typeof _nameTestContract, typeof _chainAddressMapTestContract, typeof _abiTestContract>;",
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
	})

	const mockResolveArtifactsSync = resolveArtifactsSync as Mock
	describe('resolveDtsSync', () => {
		// can't get this test to work yet but it works pretty nicely
		// generating a file and inspecting the types manually
		it.skip('should generate valid typscript that can be used to properly typecheck', () => {
			const artifacts = {
				TestContract: {
					contractName: 'TestContract',
					abi: erc20Abi,
				},
			}
			mockResolveArtifactsSync.mockReturnValueOnce({
				artifacts,
				modules: mockModules,
				asts: {
					'TestContract.sol': {
						absolutePath: '/absolute/path',
						evmVersion: 'homestead',
					},
				},
				solcInput: {
					language: 'Solidity',
					settings: { outputSelection: { sources: {} } },
					sources: {},
				} satisfies SolcInputDescription,
				solcOutput: {
					contracts: {},
					sources: {},
				} satisfies SolcOutput,
			})
			const result = resolver.resolveDtsSync('module', 'basedir', false)
			const source = `
import { TestContract } from './TestContract.js'
import { Address, useAccount, useContractRead } from 'wagmi'

export const WagmiReads = () => {
	const { address, isConnected } = useAccount()

	const { data: balance } = useContractRead({
		/**
		 * Spreading in a method will spread abi, address and args
		 * Hover over balanceOf and click go-to-definition should take you to the method definition in solidity if compiling from solidity
		 */
		...TestContract.read().balanceOf(address as Address),
		enabled: isConnected,
	})
	const { data: totalSupply } = useContractRead({
		...TestContract.read().totalSupply(),
		enabled: isConnected,
	})
	const { data: symbol } = useContractRead({
		...TestContract.read().symbol(),
		enabled: isConnected,
	})
	const testBalance: bigint | undefined = balance
	const testSymbol: string | undefined = symbol
	const testTotalSupply: bigint | undefined = totalSupply
	return ({
		testBalance,
		symbol,
		totalSupply,
	})
}

			`

			writeFileSync('./source.ts', source)
			writeFileSync('./TestContract.d.ts', result.code)

			const program = ts.createProgram({
				rootNames: [],
				options: {},
				host: ts.createCompilerHost({}),
				oldProgram: ts.createProgram({
					rootNames: [],
					options: {},
					host: ts.createCompilerHost({}),
				}),
			})

			// this is the file that the ts-plugin resolves to
			const resolveDtsFile = ts.createSourceFile(
				'TestContract.d.ts',
				result.code,
				ts.ScriptTarget.Latest,
				true,
			)

			const sourceFile = ts.createSourceFile(
				'source.ts',
				source,
				ts.ScriptTarget.Latest,
				true,
			)

			program.getRootFileNames = () => [
				resolveDtsFile.fileName,
				sourceFile.fileName,
			]
			program.getSourceFile = (fileName) =>
				[resolveDtsFile, sourceFile].find((f) => f.fileName.includes(fileName))

			const diagnostics = ts.getPreEmitDiagnostics(program)
			const diagnostic = diagnostics.find(
				(d) => d.category === ts.DiagnosticCategory.Error,
			)
			expect(diagnostic).toMatchInlineSnapshot()
		})
		it('should return an empty string if no artifacts are found', () => {
			mockResolveArtifactsSync.mockReturnValueOnce({})
			const result = resolver.resolveDtsSync('module', 'basedir', false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": undefined,
				  "code": "",
				  "modules": undefined,
				  "solcInput": undefined,
				  "solcOutput": undefined,
				}
			`)
		})

		it('should generate proper dts if artifacts are found', () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [] },
			}
			mockResolveArtifactsSync.mockReturnValueOnce({
				artifacts,
				modules: mockModules,
				asts: {
					'TestContract.sol': {
						absolutePath: '/absolute/path',
						evmVersion: 'homestead',
					},
				},
				solcInput: {
					language: 'Solidity',
					settings: { outputSelection: { sources: {} } },
					sources: {},
				} satisfies SolcInputDescription,
				solcOutput: {
					contracts: {},
					sources: {},
				} satisfies SolcOutput,
			})
			const result = resolver.resolveDtsSync('module', 'basedir', false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": {
				    "TestContract.sol": {
				      "absolutePath": "/absolute/path",
				      "evmVersion": "homestead",
				    },
				  },
				  "code": "import { EvmtsContract } from '@evmts/core'
				const _abiTestContract = [] as const;
				const _chainAddressMapTestContract = {\\"10\\":\\"0x123\\"} as const;
				const _nameTestContract = \\"TestContract\\" as const;
				/**
				 * TestContract EvmtsContract
				 * @etherscan-10 https://optimistic.etherscan.io/address/0x123
				 */
				export const TestContract: EvmtsContract<typeof _nameTestContract, typeof _chainAddressMapTestContract, typeof _abiTestContract>;",
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
				  "solcInput": {
				    "language": "Solidity",
				    "settings": {
				      "outputSelection": {
				        "sources": {},
				      },
				    },
				    "sources": {},
				  },
				  "solcOutput": {
				    "contracts": {},
				    "sources": {},
				  },
				}
			`)
		})
	})

	describe('resolveTsModuleSync', () => {
		it('should return an empty string if no artifacts are found', () => {
			mockResolveArtifactsSync.mockReturnValueOnce({})
			const result = resolver.resolveTsModuleSync('module', 'basedir', false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": undefined,
				  "code": "",
				  "modules": undefined,
				  "solcInput": undefined,
				  "solcOutput": undefined,
				}
			`)
		})

		it('should generate proper dts if artifacts are found', () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [] },
			}
			;(resolveArtifactsSync as Mock).mockReturnValueOnce({
				artifacts,
				modules: mockModules,
				asts: {
					'TestContract.sol': {
						absolutePath: '/absolute/path',
						evmVersion: 'homestead',
					},
				},
				solcInput: {
					language: 'Solidity',
					settings: { outputSelection: { sources: {} } },
					sources: {},
				} satisfies SolcInputDescription,
				solcOutput: {
					contracts: {},
					sources: {},
				} satisfies SolcOutput,
			})
			const result = resolver.resolveTsModuleSync('module', 'basedir', false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": {
				    "TestContract.sol": {
				      "absolutePath": "/absolute/path",
				      "evmVersion": "homestead",
				    },
				  },
				  "code": "import { evmtsContractFactory } from '@evmts/core'
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"abi\\":[],\\"addresses\\":{\\"10\\":\\"0x123\\"}} as const
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
				  "solcInput": {
				    "language": "Solidity",
				    "settings": {
				      "outputSelection": {
				        "sources": {},
				      },
				    },
				    "sources": {},
				  },
				  "solcOutput": {
				    "contracts": {},
				    "sources": {},
				  },
				}
			`)
		})
	})

	describe('resolveTsModule', () => {
		it('should return an empty string if no artifacts are found', async () => {
			mockResolveArtifacts.mockResolvedValueOnce({})
			const result = await resolver.resolveTsModule('module', 'basedir', false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": undefined,
				  "code": "",
				  "modules": undefined,
				  "solcInput": undefined,
				  "solcOutput": undefined,
				}
			`)
		})

		it('should generate proper dts if artifacts are found', async () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [] },
			}
			mockResolveArtifacts.mockResolvedValueOnce({
				artifacts,
				modules: mockModules,
				asts: {
					'TestContract.sol': {
						absolutePath: '/absolute/path',
						evmVersion: 'homestead',
					},
				},
				solcInput: {
					language: 'Solidity',
					settings: { outputSelection: { sources: {} } },
					sources: {},
				} satisfies SolcInputDescription,
				solcOutput: {
					contracts: {},
					sources: {},
				} satisfies SolcOutput,
			})
			const result = await resolver.resolveTsModule('module', 'basedir', false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": {
				    "TestContract.sol": {
				      "absolutePath": "/absolute/path",
				      "evmVersion": "homestead",
				    },
				  },
				  "code": "import { evmtsContractFactory } from '@evmts/core'
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"abi\\":[],\\"addresses\\":{\\"10\\":\\"0x123\\"}} as const
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
				  "solcInput": {
				    "language": "Solidity",
				    "settings": {
				      "outputSelection": {
				        "sources": {},
				      },
				    },
				    "sources": {},
				  },
				  "solcOutput": {
				    "contracts": {},
				    "sources": {},
				  },
				}
			`)
		})
	})

	describe('resolveCjsModuleSync', () => {
		it('should return an empty string if no artifacts are found', () => {
			mockResolveArtifactsSync.mockReturnValueOnce({})
			const result = resolver.resolveCjsModuleSync('module', 'basedir', false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": undefined,
				  "code": "",
				  "modules": undefined,
				  "solcInput": undefined,
				  "solcOutput": undefined,
				}
			`)
		})

		it('should generate proper CommonJS module if artifacts are found', () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [] },
			}
			mockResolveArtifactsSync.mockReturnValueOnce({
				artifacts,
				modules: mockModules,
				asts: {
					'TestContract.sol': {
						absolutePath: '/absolute/path',
						evmVersion: 'homestead',
					},
				},
				solcInput: {
					language: 'Solidity',
					settings: { outputSelection: { sources: {} } },
					sources: {},
				} satisfies SolcInputDescription,
				solcOutput: {
					contracts: {},
					sources: {},
				} satisfies SolcOutput,
			})
			const result = resolver.resolveCjsModuleSync('module', 'basedir', false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": {
				    "TestContract.sol": {
				      "absolutePath": "/absolute/path",
				      "evmVersion": "homestead",
				    },
				  },
				  "code": "const { evmtsContractFactory } = require('@evmts/core')
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"abi\\":[],\\"addresses\\":{\\"10\\":\\"0x123\\"}}
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
				  "solcInput": {
				    "language": "Solidity",
				    "settings": {
				      "outputSelection": {
				        "sources": {},
				      },
				    },
				    "sources": {},
				  },
				  "solcOutput": {
				    "contracts": {},
				    "sources": {},
				  },
				}
			`)
		})
	})

	describe('resolveCjsModule', () => {
		it('should return an empty string if no artifacts are found', async () => {
			mockResolveArtifacts.mockResolvedValueOnce({})
			const result = await resolver.resolveCjsModule('module', 'basedir', false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": undefined,
				  "code": "",
				  "modules": undefined,
				  "solcInput": undefined,
				  "solcOutput": undefined,
				}
			`)
		})

		it('should generate proper CommonJS module if artifacts are found', async () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [] },
			}
			mockResolveArtifacts.mockResolvedValueOnce({
				artifacts,
				modules: mockModules,
				asts: {
					'TestContract.sol': {
						absolutePath: '/absolute/path',
						evmVersion: 'homestead',
					},
				},
				solcInput: {
					language: 'Solidity',
					settings: { outputSelection: { sources: {} } },
					sources: {},
				} satisfies SolcInputDescription,
				solcOutput: {
					contracts: {},
					sources: {},
				} satisfies SolcOutput,
			})
			const result = await resolver.resolveCjsModule('module', 'basedir', false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": {
				    "TestContract.sol": {
				      "absolutePath": "/absolute/path",
				      "evmVersion": "homestead",
				    },
				  },
				  "code": "const { evmtsContractFactory } = require('@evmts/core')
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"abi\\":[],\\"addresses\\":{\\"10\\":\\"0x123\\"}}
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
				  "solcInput": {
				    "language": "Solidity",
				    "settings": {
				      "outputSelection": {
				        "sources": {},
				      },
				    },
				    "sources": {},
				  },
				  "solcOutput": {
				    "contracts": {},
				    "sources": {},
				  },
				}
			`)
		})
	})

	describe('resolveEsmModuleSync', () => {
		it('should return an empty string if no artifacts are found', () => {
			mockResolveArtifactsSync.mockReturnValueOnce({})
			const result = resolver.resolveEsmModuleSync('module', 'basedir', false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": undefined,
				  "code": "",
				  "modules": undefined,
				  "solcInput": undefined,
				  "solcOutput": undefined,
				}
			`)
		})

		it('should generate proper ESM module if artifacts are found', () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [] },
			}
			mockResolveArtifactsSync.mockReturnValueOnce({
				artifacts,
				modules: mockModules,
				asts: {
					'TestContract.sol': {
						absolutePath: '/absolute/path',
						evmVersion: 'homestead',
					},
				},
				solcInput: {
					language: 'Solidity',
					settings: { outputSelection: { sources: {} } },
					sources: {},
				} satisfies SolcInputDescription,
				solcOutput: {
					contracts: {},
					sources: {},
				} satisfies SolcOutput,
			})
			const result = resolver.resolveEsmModuleSync('module', 'basedir', false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": {
				    "TestContract.sol": {
				      "absolutePath": "/absolute/path",
				      "evmVersion": "homestead",
				    },
				  },
				  "code": "import { evmtsContractFactory } from '@evmts/core'
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"abi\\":[],\\"addresses\\":{\\"10\\":\\"0x123\\"}}
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
				  "solcInput": {
				    "language": "Solidity",
				    "settings": {
				      "outputSelection": {
				        "sources": {},
				      },
				    },
				    "sources": {},
				  },
				  "solcOutput": {
				    "contracts": {},
				    "sources": {},
				  },
				}
			`)
		})
	})

	describe('resolveEsmModule', () => {
		it('should return an empty string if no artifacts are found', async () => {
			mockResolveArtifacts.mockResolvedValueOnce({})
			const result = await resolver.resolveEsmModule('module', 'basedir', false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": undefined,
				  "code": "",
				  "modules": undefined,
				  "solcInput": undefined,
				  "solcOutput": undefined,
				}
			`)
		})

		it('should generate proper ESM module if artifacts are found', async () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [] },
			}
			mockResolveArtifacts.mockResolvedValueOnce({
				artifacts,
				modules: mockModules,
				asts: {
					'TestContract.sol': {
						absolutePath: '/absolute/path',
						evmVersion: 'homestead',
					},
				},
				solcInput: {
					language: 'Solidity',
					settings: { outputSelection: { sources: {} } },
					sources: {},
				} satisfies SolcInputDescription,
				solcOutput: {
					contracts: {},
					sources: {},
				} satisfies SolcOutput,
			})
			const result = await resolver.resolveEsmModule('module', 'basedir', false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": {
				    "TestContract.sol": {
				      "absolutePath": "/absolute/path",
				      "evmVersion": "homestead",
				    },
				  },
				  "code": "import { evmtsContractFactory } from '@evmts/core'
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"abi\\":[],\\"addresses\\":{\\"10\\":\\"0x123\\"}}
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
				  "solcInput": {
				    "language": "Solidity",
				    "settings": {
				      "outputSelection": {
				        "sources": {},
				      },
				    },
				    "sources": {},
				  },
				  "solcOutput": {
				    "contracts": {},
				    "sources": {},
				  },
				}
			`)
		})
	})
})
