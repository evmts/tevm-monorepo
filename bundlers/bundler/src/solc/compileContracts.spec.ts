import type { ModuleInfo } from '../types'
import { compileContractSync } from './compileContracts'
import { moduleFactory } from './moduleFactory'
import type { ResolvedConfig } from '@evmts/config'
import { readFileSync } from 'fs'
import * as resolve from 'resolve'
// TODO wrap this in a typesafe version
// @ts-ignore
import solc from 'solc'
import {
	type Mock,
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

// Mock the necessary functions and modules
vi.mock('fs', () => ({ readFileSync: vi.fn() }))
vi.mock('resolve', () => ({ sync: vi.fn() }))
vi.mock('solc', () => {
	const defaultExport = { compile: vi.fn() }
	return { default: defaultExport, ...defaultExport }
})
vi.mock('./moduleFactory', () => ({ moduleFactory: vi.fn() }))
const ConsoleMock = {
	log: vi.fn(),
	error: vi.fn(),
	warn: vi.fn(),
	info: vi.fn(),
	debug: vi.fn(),
}

vi.stubGlobal('console', ConsoleMock)

describe('compileContractSync', () => {
	const filePath = 'test/path'
	const basedir = 'base/dir'
	const config: ResolvedConfig['compiler'] = {
		foundryProject: 'forge',
		solcVersion: '4.2.0',
		remappings: { 'key1/': '/path/to/key1', 'key2/': '/path/to/key2' },
		libs: ['lib1', 'lib2'],
	}
	const mockSource = ['import ./resolutionFile.sol', 'contract Test {}'].join(
		'\n',
	)
	const mockResolution: ModuleInfo = {
		id: 'test/path/resolutionFile.sol',
		code: 'contract Resolution {}',
		importedIds: [],
		resolutions: [],
		rawCode: 'contract Resolution {}',
	}
	const mockModule: ModuleInfo = {
		rawCode: mockSource,
		id: filePath,
		code: mockSource.replace(
			'./resolutionFile.sol',
			'test/path/resolutionFile.sol',
		),
		importedIds: ['./importedId'],
		resolutions: [mockResolution],
	}
	const mockCompiledContract = {
		Test: { abi: [], evm: { bytecode: { object: '0x123' } } },
	}

	const mockReadFileSync = readFileSync as Mock
	const mockResolveSync = resolve.sync as Mock
	const mockModuleFactory = moduleFactory as Mock
	const mockSolcCompile = solc.compile as Mock
	beforeEach(() => {
		mockReadFileSync.mockReturnValue(mockSource)
		mockResolveSync.mockReturnValue(filePath)
		mockModuleFactory.mockReturnValue(mockModule)
		mockSolcCompile.mockReturnValue(
			JSON.stringify({
				contracts: { [filePath]: mockCompiledContract },
				sources: {
					[filePath]: { ast: 'ast' },
				},
				errors: [],
			}),
		)
	})

	it('should compile a contract correctly with ast', () => {
		const compiledContract = compileContractSync(
			filePath,
			basedir,
			config,
			true,
		)

		expect(compiledContract).toMatchInlineSnapshot(`
			{
			  "artifacts": {
			    "Test": {
			      "abi": [],
			      "evm": {
			        "bytecode": {
			          "object": "0x123",
			        },
			      },
			    },
			  },
			  "asts": {
			    "test/path": "ast",
			  },
			  "modules": {
			    "test/path": {
			      "code": "import test/path/resolutionFile.sol
			contract Test {}",
			      "id": "test/path",
			      "importedIds": [
			        "./importedId",
			      ],
			      "rawCode": "import ./resolutionFile.sol
			contract Test {}",
			      "resolutions": [
			        {
			          "code": "contract Resolution {}",
			          "id": "test/path/resolutionFile.sol",
			          "importedIds": [],
			          "rawCode": "contract Resolution {}",
			          "resolutions": [],
			        },
			      ],
			    },
			    "test/path/resolutionFile.sol": {
			      "code": "contract Resolution {}",
			      "id": "test/path/resolutionFile.sol",
			      "importedIds": [],
			      "rawCode": "contract Resolution {}",
			      "resolutions": [],
			    },
			  },
			  "solcInput": {
			    "language": "Solidity",
			    "settings": {
			      "outputSelection": {
			        "*": {
			          "": [
			            "ast",
			          ],
			          "*": [
			            "abi",
			            "userdoc",
			          ],
			        },
			      },
			    },
			    "sources": {
			      "test/path": {
			        "content": "import test/path/resolutionFile.sol
			contract Test {}",
			      },
			      "test/path/resolutionFile.sol": {
			        "content": "contract Resolution {}",
			      },
			    },
			  },
			  "solcOutput": {
			    "contracts": {
			      "test/path": {
			        "Test": {
			          "abi": [],
			          "evm": {
			            "bytecode": {
			              "object": "0x123",
			            },
			          },
			        },
			      },
			    },
			    "errors": [],
			    "sources": {
			      "test/path": {
			        "ast": "ast",
			      },
			    },
			  },
			}
		`)
		expect(readFileSync).toBeCalledWith(filePath, 'utf8')
		expect(resolve.sync).toBeCalledWith(filePath, { basedir })
		expect(moduleFactory).toBeCalledWith(
			filePath,
			mockSource,
			config.remappings,
			config.libs,
		)
		expect((solc.compile as Mock).mock.lastCall).toMatchInlineSnapshot(`
			[
			  "{\\"language\\":\\"Solidity\\",\\"sources\\":{\\"test/path\\":{\\"content\\":\\"import test/path/resolutionFile.sol\\\\ncontract Test {}\\"},\\"test/path/resolutionFile.sol\\":{\\"content\\":\\"contract Resolution {}\\"}},\\"settings\\":{\\"outputSelection\\":{\\"*\\":{\\"*\\":[\\"abi\\",\\"userdoc\\"],\\"\\":[\\"ast\\"]}}}}",
			]
		`)
	})

	it('should compile a contract correctly', () => {
		const compiledContract = compileContractSync(
			filePath,
			basedir,
			config,
			false,
		)

		expect(compiledContract).toMatchInlineSnapshot(`
			{
			  "artifacts": {
			    "Test": {
			      "abi": [],
			      "evm": {
			        "bytecode": {
			          "object": "0x123",
			        },
			      },
			    },
			  },
			  "asts": undefined,
			  "modules": {
			    "test/path": {
			      "code": "import test/path/resolutionFile.sol
			contract Test {}",
			      "id": "test/path",
			      "importedIds": [
			        "./importedId",
			      ],
			      "rawCode": "import ./resolutionFile.sol
			contract Test {}",
			      "resolutions": [
			        {
			          "code": "contract Resolution {}",
			          "id": "test/path/resolutionFile.sol",
			          "importedIds": [],
			          "rawCode": "contract Resolution {}",
			          "resolutions": [],
			        },
			      ],
			    },
			    "test/path/resolutionFile.sol": {
			      "code": "contract Resolution {}",
			      "id": "test/path/resolutionFile.sol",
			      "importedIds": [],
			      "rawCode": "contract Resolution {}",
			      "resolutions": [],
			    },
			  },
			  "solcInput": {
			    "language": "Solidity",
			    "settings": {
			      "outputSelection": {
			        "*": {
			          "*": [
			            "abi",
			            "userdoc",
			          ],
			        },
			      },
			    },
			    "sources": {
			      "test/path": {
			        "content": "import test/path/resolutionFile.sol
			contract Test {}",
			      },
			      "test/path/resolutionFile.sol": {
			        "content": "contract Resolution {}",
			      },
			    },
			  },
			  "solcOutput": {
			    "contracts": {
			      "test/path": {
			        "Test": {
			          "abi": [],
			          "evm": {
			            "bytecode": {
			              "object": "0x123",
			            },
			          },
			        },
			      },
			    },
			    "errors": [],
			    "sources": {
			      "test/path": {
			        "ast": "ast",
			      },
			    },
			  },
			}
		`)
		expect(readFileSync).toBeCalledWith(filePath, 'utf8')
		expect(resolve.sync).toBeCalledWith(filePath, { basedir })
		expect(moduleFactory).toBeCalledWith(
			filePath,
			mockSource,
			config.remappings,
			config.libs,
		)
		expect((solc.compile as Mock).mock.lastCall).toMatchInlineSnapshot(`
			[
			  "{\\"language\\":\\"Solidity\\",\\"sources\\":{\\"test/path\\":{\\"content\\":\\"import test/path/resolutionFile.sol\\\\ncontract Test {}\\"},\\"test/path/resolutionFile.sol\\":{\\"content\\":\\"contract Resolution {}\\"}},\\"settings\\":{\\"outputSelection\\":{\\"*\\":{\\"*\\":[\\"abi\\",\\"userdoc\\"]}}}}",
			]
		`)
	})

	it('should throw error if compilation fails', () => {
		mockSolcCompile.mockReturnValue(
			JSON.stringify({
				contracts: { [filePath]: null },
				errors: [{ type: 'Error', message: 'Compilation Error' }],
			}),
		)
		expect(() =>
			compileContractSync(filePath, basedir, config, false),
		).toThrowErrorMatchingInlineSnapshot('"Compilation failed"')
		expect(console.error).toHaveBeenCalledWith('Compilation errors:', [
			{ type: 'Error', message: 'Compilation Error' },
		])
	})

	it('should log warnings if there are any', () => {
		mockSolcCompile.mockReturnValue(
			JSON.stringify({
				contracts: { [filePath]: mockCompiledContract },
				errors: [{ type: 'Warning', message: 'Compilation Warning' }],
			}),
		)
		compileContractSync(filePath, basedir, config, false)
		expect((console.warn as Mock).mock.lastCall[0]).toMatchInlineSnapshot(
			'"Compilation warnings:"',
		)
	})

	it('should not log any warnings when there are no warnings', () => {
		mockSolcCompile.mockReturnValue(
			JSON.stringify({
				contracts: { [filePath]: mockCompiledContract },
				errors: [],
			}),
		)
		compileContractSync(filePath, basedir, config, false)
		expect(console.warn).not.toHaveBeenCalled()
	})

	it('should work when contracts share resolutions', () => {
		const mockModuleC: ModuleInfo = {
			id: 'test/path/moduleC.sol',
			code: 'contract C {}',
			importedIds: [],
			resolutions: [],
			rawCode: 'contract C {}',
		}

		const mockModuleA: ModuleInfo = {
			id: 'test/path/moduleA.sol',
			code: 'import "test/path/moduleC.sol"\ncontract A {}',
			importedIds: ['test/path/moduleC.sol'],
			resolutions: [mockModuleC],
			rawCode: 'import "./moduleC.sol"\ncontract A {}',
		}

		const mockModuleB: ModuleInfo = {
			id: 'test/path/moduleB.sol',
			code: 'import "test/path/moduleC.sol"\ncontract B {}',
			importedIds: ['test/path/moduleC.sol'],
			resolutions: [mockModuleC],
			rawCode: 'import "./moduleC.sol"\ncontract B {}',
		}

		mockModuleA.resolutions.push(mockModuleB)
		mockModuleFactory.mockReturnValue(mockModuleA)
		expect(
			compileContractSync(filePath, basedir, config, false),
		).toMatchInlineSnapshot(`
			{
			  "artifacts": undefined,
			  "asts": undefined,
			  "modules": {
			    "test/path/moduleA.sol": {
			      "code": "import \\"test/path/moduleC.sol\\"
			contract A {}",
			      "id": "test/path/moduleA.sol",
			      "importedIds": [
			        "test/path/moduleC.sol",
			      ],
			      "rawCode": "import \\"./moduleC.sol\\"
			contract A {}",
			      "resolutions": [
			        {
			          "code": "contract C {}",
			          "id": "test/path/moduleC.sol",
			          "importedIds": [],
			          "rawCode": "contract C {}",
			          "resolutions": [],
			        },
			        {
			          "code": "import \\"test/path/moduleC.sol\\"
			contract B {}",
			          "id": "test/path/moduleB.sol",
			          "importedIds": [
			            "test/path/moduleC.sol",
			          ],
			          "rawCode": "import \\"./moduleC.sol\\"
			contract B {}",
			          "resolutions": [
			            {
			              "code": "contract C {}",
			              "id": "test/path/moduleC.sol",
			              "importedIds": [],
			              "rawCode": "contract C {}",
			              "resolutions": [],
			            },
			          ],
			        },
			      ],
			    },
			    "test/path/moduleB.sol": {
			      "code": "import \\"test/path/moduleC.sol\\"
			contract B {}",
			      "id": "test/path/moduleB.sol",
			      "importedIds": [
			        "test/path/moduleC.sol",
			      ],
			      "rawCode": "import \\"./moduleC.sol\\"
			contract B {}",
			      "resolutions": [
			        {
			          "code": "contract C {}",
			          "id": "test/path/moduleC.sol",
			          "importedIds": [],
			          "rawCode": "contract C {}",
			          "resolutions": [],
			        },
			      ],
			    },
			    "test/path/moduleC.sol": {
			      "code": "contract C {}",
			      "id": "test/path/moduleC.sol",
			      "importedIds": [],
			      "rawCode": "contract C {}",
			      "resolutions": [],
			    },
			  },
			  "solcInput": {
			    "language": "Solidity",
			    "settings": {
			      "outputSelection": {
			        "*": {
			          "*": [
			            "abi",
			            "userdoc",
			          ],
			        },
			      },
			    },
			    "sources": {
			      "test/path/moduleA.sol": {
			        "content": "import \\"test/path/moduleC.sol\\"
			contract A {}",
			      },
			      "test/path/moduleB.sol": {
			        "content": "import \\"test/path/moduleC.sol\\"
			contract B {}",
			      },
			      "test/path/moduleC.sol": {
			        "content": "contract C {}",
			      },
			    },
			  },
			  "solcOutput": {
			    "contracts": {
			      "test/path": {
			        "Test": {
			          "abi": [],
			          "evm": {
			            "bytecode": {
			              "object": "0x123",
			            },
			          },
			        },
			      },
			    },
			    "errors": [],
			    "sources": {
			      "test/path": {
			        "ast": "ast",
			      },
			    },
			  },
			}
		`)
	})

	afterEach(() => {
		vi.clearAllMocks()
	})
})
