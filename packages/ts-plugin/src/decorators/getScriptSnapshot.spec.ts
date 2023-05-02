import { getScriptSnapshotDecorator } from '.'
import { Config, Logger } from '../factories'
import path from 'path'
import typescript from 'typescript/lib/tsserverlibrary'
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest'

const forgeProject = path.join(__dirname, '../..')

const config: Config = {
  name: '@evmts/ts-plugin',
  project: '.',
  out: 'artifacts',
}

describe(getScriptSnapshotDecorator.name, () => {
  let logger: Logger
  let languageServiceHost: {
    getScriptSnapshot: Mock
  }

  let project = {
    getCurrentDirectory: vi.fn(),
  }
  beforeEach(() => {
    logger = {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
    }
    project = {
      getCurrentDirectory: vi.fn(),
    }
    project.getCurrentDirectory.mockReturnValue(forgeProject)
    languageServiceHost = {
      getScriptSnapshot: vi.fn(),
    }
  })

  it('should proxy to the languageServiceHost for non solidity files', () => {
    const expectedReturn = `
    export type Foo = string
    `
    languageServiceHost.getScriptSnapshot.mockReturnValue(expectedReturn)
    const decorator = getScriptSnapshotDecorator(
      { languageServiceHost, project } as any,
      typescript,
      logger,
      config,
    )
    const fileName = 'foo.ts'
    const result = decorator.getScriptSnapshot(fileName)
    expect(result).toEqual(expectedReturn)
    expect(languageServiceHost.getScriptSnapshot).toHaveBeenCalledWith(fileName)
  })

  it('should return a generated .d.ts file for solidity files', () => {
    const decorator = getScriptSnapshotDecorator(
      { languageServiceHost, project } as any,
      typescript,
      logger,
      config,
    )
    const fileName = path.join(__dirname, '../test/fixtures/HelloWorld.sol')
    const result = decorator.getScriptSnapshot(fileName)
    expect(project.getCurrentDirectory).toHaveBeenCalledOnce()
    expect((result as any).text).toMatchInlineSnapshot(`
      "
                    const abi = {
        \\"abi\\": [
          {
            \\"inputs\\": [],
            \\"name\\": \\"greet\\",
            \\"outputs\\": [
              {
                \\"internalType\\": \\"string\\",
                \\"name\\": \\"\\",
                \\"type\\": \\"string\\"
              }
            ],
            \\"stateMutability\\": \\"pure\\",
            \\"type\\": \\"function\\"
          }
        ],
        \\"bytecode\\": {
          \\"object\\": \\"0x608060405234801561001057600080fd5b5060ea8061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063cfae321714602d575b600080fd5b604080518082018252600b81527f48656c6c6f20576f726c6400000000000000000000000000000000000000000060208201529051606a91906073565b60405180910390f35b600060208083528351808285015260005b81811015609e578581018301518582016040015282016084565b5060006040828601015260407fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f830116850101925050509291505056fea164736f6c6343000811000a\\",
          \\"sourceMap\\": \\"25:118:0:-:0;;;;;;;;;;;;;;;;;;;\\",
          \\"linkReferences\\": {}
        },
        \\"deployedBytecode\\": {
          \\"object\\": \\"0x6080604052348015600f57600080fd5b506004361060285760003560e01c8063cfae321714602d575b600080fd5b604080518082018252600b81527f48656c6c6f20576f726c6400000000000000000000000000000000000000000060208201529051606a91906073565b60405180910390f35b600060208083528351808285015260005b81811015609e578581018301518582016040015282016084565b5060006040828601015260407fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f830116850101925050509291505056fea164736f6c6343000811000a\\",
          \\"sourceMap\\": \\"25:118:0:-:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;51:90;114:20;;;;;;;;;;;;;;;;51:90;;;;114:20;51:90;:::i;:::-;;;;;;;;14:607:1;126:4;155:2;184;173:9;166:21;216:6;210:13;259:6;254:2;243:9;239:18;232:34;284:1;294:140;308:6;305:1;302:13;294:140;;;403:14;;;399:23;;393:30;369:17;;;388:2;365:26;358:66;323:10;;294:140;;;298:3;483:1;478:2;469:6;458:9;454:22;450:31;443:42;612:2;542:66;537:2;529:6;525:15;521:88;510:9;506:104;502:113;494:121;;;;14:607;;;;:::o\\",
          \\"linkReferences\\": {}
        },
        \\"methodIdentifiers\\": {
          \\"greet()\\": \\"cfae3217\\"
        },
        \\"rawMetadata\\": \\"{\\\\\\"compiler\\\\\\":{\\\\\\"version\\\\\\":\\\\\\"0.8.17+commit.8df45f5f\\\\\\"},\\\\\\"language\\\\\\":\\\\\\"Solidity\\\\\\",\\\\\\"output\\\\\\":{\\\\\\"abi\\\\\\":[{\\\\\\"inputs\\\\\\":[],\\\\\\"name\\\\\\":\\\\\\"greet\\\\\\",\\\\\\"outputs\\\\\\":[{\\\\\\"internalType\\\\\\":\\\\\\"string\\\\\\",\\\\\\"name\\\\\\":\\\\\\"\\\\\\",\\\\\\"type\\\\\\":\\\\\\"string\\\\\\"}],\\\\\\"stateMutability\\\\\\":\\\\\\"pure\\\\\\",\\\\\\"type\\\\\\":\\\\\\"function\\\\\\"}],\\\\\\"devdoc\\\\\\":{\\\\\\"kind\\\\\\":\\\\\\"dev\\\\\\",\\\\\\"methods\\\\\\":{},\\\\\\"version\\\\\\":1},\\\\\\"userdoc\\\\\\":{\\\\\\"kind\\\\\\":\\\\\\"user\\\\\\",\\\\\\"methods\\\\\\":{},\\\\\\"version\\\\\\":1}},\\\\\\"settings\\\\\\":{\\\\\\"compilationTarget\\\\\\":{\\\\\\"src/test/fixtures/HelloWorld.sol\\\\\\":\\\\\\"HelloWorld\\\\\\"},\\\\\\"evmVersion\\\\\\":\\\\\\"london\\\\\\",\\\\\\"libraries\\\\\\":{},\\\\\\"metadata\\\\\\":{\\\\\\"bytecodeHash\\\\\\":\\\\\\"none\\\\\\"},\\\\\\"optimizer\\\\\\":{\\\\\\"enabled\\\\\\":true,\\\\\\"runs\\\\\\":1000000},\\\\\\"remappings\\\\\\":[\\\\\\":@openzeppelin/contracts/=node_modules/@openzeppelin/contracts/\\\\\\"]},\\\\\\"sources\\\\\\":{\\\\\\"src/test/fixtures/HelloWorld.sol\\\\\\":{\\\\\\"keccak256\\\\\\":\\\\\\"0x716192843309be768bbad9294531ab844616433aed9cbc2be52435e3aa52c32f\\\\\\",\\\\\\"urls\\\\\\":[\\\\\\"bzz-raw://e9e940379077c8ed29ed726f6ddccb5926bdff5243ae1aade360cb16c29800a1\\\\\\",\\\\\\"dweb:/ipfs/QmXongSsyMNR3FneYaMrFgBCvCXW9Fnky33m8F8LLtPG5n\\\\\\"]}},\\\\\\"version\\\\\\":1}\\",
        \\"metadata\\": {
          \\"compiler\\": {
            \\"version\\": \\"0.8.17+commit.8df45f5f\\"
          },
          \\"language\\": \\"Solidity\\",
          \\"output\\": {
            \\"abi\\": [
              {
                \\"inputs\\": [],
                \\"stateMutability\\": \\"pure\\",
                \\"type\\": \\"function\\",
                \\"name\\": \\"greet\\",
                \\"outputs\\": [
                  {
                    \\"internalType\\": \\"string\\",
                    \\"name\\": \\"\\",
                    \\"type\\": \\"string\\"
                  }
                ]
              }
            ],
            \\"devdoc\\": {
              \\"kind\\": \\"dev\\",
              \\"methods\\": {},
              \\"version\\": 1
            },
            \\"userdoc\\": {
              \\"kind\\": \\"user\\",
              \\"methods\\": {},
              \\"version\\": 1
            }
          },
          \\"settings\\": {
            \\"remappings\\": [
              \\":@openzeppelin/contracts/=node_modules/@openzeppelin/contracts/\\"
            ],
            \\"optimizer\\": {
              \\"enabled\\": true,
              \\"runs\\": 1000000
            },
            \\"metadata\\": {
              \\"bytecodeHash\\": \\"none\\"
            },
            \\"compilationTarget\\": {
              \\"src/test/fixtures/HelloWorld.sol\\": \\"HelloWorld\\"
            },
            \\"libraries\\": {}
          },
          \\"sources\\": {
            \\"src/test/fixtures/HelloWorld.sol\\": {
              \\"keccak256\\": \\"0x716192843309be768bbad9294531ab844616433aed9cbc2be52435e3aa52c32f\\",
              \\"urls\\": [
                \\"bzz-raw://e9e940379077c8ed29ed726f6ddccb5926bdff5243ae1aade360cb16c29800a1\\",
                \\"dweb:/ipfs/QmXongSsyMNR3FneYaMrFgBCvCXW9Fnky33m8F8LLtPG5n\\"
              ],
              \\"license\\": null
            }
          },
          \\"version\\": 1
        },
        \\"ast\\": {
          \\"absolutePath\\": \\"src/test/fixtures/HelloWorld.sol\\",
          \\"id\\": 11,
          \\"exportedSymbols\\": {
            \\"HelloWorld\\": [
              10
            ]
          },
          \\"nodeType\\": \\"SourceUnit\\",
          \\"src\\": \\"0:144:0\\",
          \\"nodes\\": [
            {
              \\"id\\": 1,
              \\"nodeType\\": \\"PragmaDirective\\",
              \\"src\\": \\"0:23:0\\",
              \\"nodes\\": [],
              \\"literals\\": [
                \\"solidity\\",
                \\"0.8\\",
                \\".17\\"
              ]
            },
            {
              \\"id\\": 10,
              \\"nodeType\\": \\"ContractDefinition\\",
              \\"src\\": \\"25:118:0\\",
              \\"nodes\\": [
                {
                  \\"id\\": 9,
                  \\"nodeType\\": \\"FunctionDefinition\\",
                  \\"src\\": \\"51:90:0\\",
                  \\"nodes\\": [],
                  \\"body\\": {
                    \\"id\\": 8,
                    \\"nodeType\\": \\"Block\\",
                    \\"src\\": \\"104:37:0\\",
                    \\"nodes\\": [],
                    \\"statements\\": [
                      {
                        \\"expression\\": {
                          \\"hexValue\\": \\"48656c6c6f20576f726c64\\",
                          \\"id\\": 6,
                          \\"isConstant\\": false,
                          \\"isLValue\\": false,
                          \\"isPure\\": true,
                          \\"kind\\": \\"string\\",
                          \\"lValueRequested\\": false,
                          \\"nodeType\\": \\"Literal\\",
                          \\"src\\": \\"121:13:0\\",
                          \\"typeDescriptions\\": {
                            \\"typeIdentifier\\": \\"t_stringliteral_592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba\\",
                            \\"typeString\\": \\"literal_string \\\\\\"Hello World\\\\\\"\\"
                          },
                          \\"value\\": \\"Hello World\\"
                        },
                        \\"functionReturnParameters\\": 5,
                        \\"id\\": 7,
                        \\"nodeType\\": \\"Return\\",
                        \\"src\\": \\"114:20:0\\"
                      }
                    ]
                  },
                  \\"functionSelector\\": \\"cfae3217\\",
                  \\"implemented\\": true,
                  \\"kind\\": \\"function\\",
                  \\"modifiers\\": [],
                  \\"name\\": \\"greet\\",
                  \\"nameLocation\\": \\"60:5:0\\",
                  \\"parameters\\": {
                    \\"id\\": 2,
                    \\"nodeType\\": \\"ParameterList\\",
                    \\"parameters\\": [],
                    \\"src\\": \\"65:2:0\\"
                  },
                  \\"returnParameters\\": {
                    \\"id\\": 5,
                    \\"nodeType\\": \\"ParameterList\\",
                    \\"parameters\\": [
                      {
                        \\"constant\\": false,
                        \\"id\\": 4,
                        \\"mutability\\": \\"mutable\\",
                        \\"name\\": \\"\\",
                        \\"nameLocation\\": \\"-1:-1:-1\\",
                        \\"nodeType\\": \\"VariableDeclaration\\",
                        \\"scope\\": 9,
                        \\"src\\": \\"89:13:0\\",
                        \\"stateVariable\\": false,
                        \\"storageLocation\\": \\"memory\\",
                        \\"typeDescriptions\\": {
                          \\"typeIdentifier\\": \\"t_string_memory_ptr\\",
                          \\"typeString\\": \\"string\\"
                        },
                        \\"typeName\\": {
                          \\"id\\": 3,
                          \\"name\\": \\"string\\",
                          \\"nodeType\\": \\"ElementaryTypeName\\",
                          \\"src\\": \\"89:6:0\\",
                          \\"typeDescriptions\\": {
                            \\"typeIdentifier\\": \\"t_string_storage_ptr\\",
                            \\"typeString\\": \\"string\\"
                          }
                        },
                        \\"visibility\\": \\"internal\\"
                      }
                    ],
                    \\"src\\": \\"88:15:0\\"
                  },
                  \\"scope\\": 10,
                  \\"stateMutability\\": \\"pure\\",
                  \\"virtual\\": false,
                  \\"visibility\\": \\"public\\"
                }
              ],
              \\"abstract\\": false,
              \\"baseContracts\\": [],
              \\"canonicalName\\": \\"HelloWorld\\",
              \\"contractDependencies\\": [],
              \\"contractKind\\": \\"contract\\",
              \\"fullyImplemented\\": true,
              \\"linearizedBaseContracts\\": [
                10
              ],
              \\"name\\": \\"HelloWorld\\",
              \\"nameLocation\\": \\"34:10:0\\",
              \\"scope\\": 11,
              \\"usedErrors\\": []
            }
          ]
        },
        \\"id\\": 0
      } as const
                    export const fileName = \\"/Users/willcory/evmts-monorepo/packages/ts-plugin/src/test/fixtures/HelloWorld.sol\\" as const
                    export const /Users/willcory/evmts-monorepo/packages/ts-plugin/src/test/fixtures/HelloWorld.sol: {
                      abi: typeof abi
                    } as const
                    "
    `)
  })
})
