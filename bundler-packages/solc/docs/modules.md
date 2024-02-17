[@tevm/solc](README.md) / Exports

# @tevm/solc

## Table of contents

### Interfaces

- [Solc](interfaces/Solc.md)

### Type Aliases

- [Releases](modules.md#releases)
- [SolcBytecodeOutput](modules.md#solcbytecodeoutput)
- [SolcContractOutput](modules.md#solccontractoutput)
- [SolcDebugSettings](modules.md#solcdebugsettings)
- [SolcDeployedBytecodeOutput](modules.md#solcdeployedbytecodeoutput)
- [SolcEVMOutput](modules.md#solcevmoutput)
- [SolcErrorEntry](modules.md#solcerrorentry)
- [SolcEwasmOutput](modules.md#solcewasmoutput)
- [SolcFunctionDebugData](modules.md#solcfunctiondebugdata)
- [SolcGasEstimates](modules.md#solcgasestimates)
- [SolcGeneratedSource](modules.md#solcgeneratedsource)
- [SolcInputDescription](modules.md#solcinputdescription)
- [SolcInputSource](modules.md#solcinputsource)
- [SolcInputSources](modules.md#solcinputsources)
- [SolcInputSourcesDestructibleSettings](modules.md#solcinputsourcesdestructiblesettings)
- [SolcLanguage](modules.md#solclanguage)
- [SolcMetadataSettings](modules.md#solcmetadatasettings)
- [SolcModelChecker](modules.md#solcmodelchecker)
- [SolcModelCheckerContracts](modules.md#solcmodelcheckercontracts)
- [SolcOptimizer](modules.md#solcoptimizer)
- [SolcOptimizerDetails](modules.md#solcoptimizerdetails)
- [SolcOutput](modules.md#solcoutput)
- [SolcOutputSelection](modules.md#solcoutputselection)
- [SolcRemapping](modules.md#solcremapping)
- [SolcSecondarySourceLocation](modules.md#solcsecondarysourcelocation)
- [SolcSettings](modules.md#solcsettings)
- [SolcSourceEntry](modules.md#solcsourceentry)
- [SolcSourceLocation](modules.md#solcsourcelocation)
- [SolcVersions](modules.md#solcversions)
- [SolcYulDetails](modules.md#solcyuldetails)

### Variables

- [releases](modules.md#releases-1)

### Functions

- [createSolc](modules.md#createsolc)
- [solcCompile](modules.md#solccompile)

## Type Aliases

### Releases

Ƭ **Releases**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `0.1.1` | ``"v0.1.1+commit.6ff4cd6"`` |
| `0.1.2` | ``"v0.1.2+commit.d0d36e3"`` |
| `0.1.3` | ``"v0.1.3+commit.028f561d"`` |
| `0.1.4` | ``"v0.1.4+commit.5f6c3cdf"`` |
| `0.1.5` | ``"v0.1.5+commit.23865e39"`` |
| `0.1.6` | ``"v0.1.6+commit.d41f8b7c"`` |
| `0.1.7` | ``"v0.1.7+commit.b4e666cc"`` |
| `0.2.0` | ``"v0.2.0+commit.4dc2445e"`` |
| `0.2.1` | ``"v0.2.1+commit.91a6b35f"`` |
| `0.2.2` | ``"v0.2.2+commit.ef92f566"`` |
| `0.3.0` | ``"v0.3.0+commit.11d67369"`` |
| `0.3.1` | ``"v0.3.1+commit.c492d9be"`` |
| `0.3.2` | ``"v0.3.2+commit.81ae2a78"`` |
| `0.3.3` | ``"v0.3.3+commit.4dc1cb14"`` |
| `0.3.4` | ``"v0.3.4+commit.7dab8902"`` |
| `0.3.5` | ``"v0.3.5+commit.5f97274a"`` |
| `0.3.6` | ``"v0.3.6+commit.3fc68da5"`` |
| `0.4.0` | ``"v0.4.0+commit.acd334c9"`` |
| `0.4.1` | ``"v0.4.1+commit.4fc6fc2c"`` |
| `0.4.10` | ``"v0.4.10+commit.f0d539ae"`` |
| `0.4.11` | ``"v0.4.11+commit.68ef5810"`` |
| `0.4.12` | ``"v0.4.12+commit.194ff033"`` |
| `0.4.13` | ``"v0.4.13+commit.0fb4cb1a"`` |
| `0.4.14` | ``"v0.4.14+commit.c2215d46"`` |
| `0.4.15` | ``"v0.4.15+commit.bbb8e64f"`` |
| `0.4.16` | ``"v0.4.16+commit.d7661dd9"`` |
| `0.4.17` | ``"v0.4.17+commit.bdeb9e52"`` |
| `0.4.18` | ``"v0.4.18+commit.9cf6e910"`` |
| `0.4.19` | ``"v0.4.19+commit.c4cbbb05"`` |
| `0.4.2` | ``"v0.4.2+commit.af6afb04"`` |
| `0.4.20` | ``"v0.4.20+commit.3155dd80"`` |
| `0.4.21` | ``"v0.4.21+commit.dfe3193c"`` |
| `0.4.22` | ``"v0.4.22+commit.4cb486ee"`` |
| `0.4.23` | ``"v0.4.23+commit.124ca40d"`` |
| `0.4.24` | ``"v0.4.24+commit.e67f0147"`` |
| `0.4.25` | ``"v0.4.25+commit.59dbf8f1"`` |
| `0.4.26` | ``"v0.4.26+commit.4563c3fc"`` |
| `0.4.3` | ``"v0.4.3+commit.2353da71"`` |
| `0.4.4` | ``"v0.4.4+commit.4633f3de"`` |
| `0.4.5` | ``"v0.4.5+commit.b318366e"`` |
| `0.4.6` | ``"v0.4.6+commit.2dabbdf0"`` |
| `0.4.7` | ``"v0.4.7+commit.822622cf"`` |
| `0.4.8` | ``"v0.4.8+commit.60cc1668"`` |
| `0.4.9` | ``"v0.4.9+commit.364da425"`` |
| `0.5.0` | ``"v0.5.0+commit.1d4f565a"`` |
| `0.5.1` | ``"v0.5.1+commit.c8a2cb62"`` |
| `0.5.10` | ``"v0.5.10+commit.5a6ea5b1"`` |
| `0.5.11` | ``"v0.5.11+commit.c082d0b4"`` |
| `0.5.12` | ``"v0.5.12+commit.7709ece9"`` |
| `0.5.13` | ``"v0.5.13+commit.5b0b510c"`` |
| `0.5.14` | ``"v0.5.14+commit.01f1aaa4"`` |
| `0.5.15` | ``"v0.5.15+commit.6a57276f"`` |
| `0.5.16` | ``"v0.5.16+commit.9c3226ce"`` |
| `0.5.17` | ``"v0.5.17+commit.d19bba13"`` |
| `0.5.2` | ``"v0.5.2+commit.1df8f40c"`` |
| `0.5.3` | ``"v0.5.3+commit.10d17f24"`` |
| `0.5.4` | ``"v0.5.4+commit.9549d8ff"`` |
| `0.5.5` | ``"v0.5.5+commit.47a71e8f"`` |
| `0.5.6` | ``"v0.5.6+commit.b259423e"`` |
| `0.5.7` | ``"v0.5.7+commit.6da8b019"`` |
| `0.5.8` | ``"v0.5.8+commit.23d335f2"`` |
| `0.5.9` | ``"v0.5.9+commit.e560f70d"`` |
| `0.6.0` | ``"v0.6.0+commit.26b70077"`` |
| `0.6.1` | ``"v0.6.1+commit.e6f7d5a4"`` |
| `0.6.10` | ``"v0.6.10+commit.00c0fcaf"`` |
| `0.6.11` | ``"v0.6.11+commit.5ef660b1"`` |
| `0.6.12` | ``"v0.6.12+commit.27d51765"`` |
| `0.6.2` | ``"v0.6.2+commit.bacdbe57"`` |
| `0.6.3` | ``"v0.6.3+commit.8dda9521"`` |
| `0.6.4` | ``"v0.6.4+commit.1dca32f3"`` |
| `0.6.5` | ``"v0.6.5+commit.f956cc89"`` |
| `0.6.6` | ``"v0.6.6+commit.6c089d02"`` |
| `0.6.7` | ``"v0.6.7+commit.b8d736ae"`` |
| `0.6.8` | ``"v0.6.8+commit.0bbfe453"`` |
| `0.6.9` | ``"v0.6.9+commit.3e3065ac"`` |
| `0.7.0` | ``"v0.7.0+commit.9e61f92b"`` |
| `0.7.1` | ``"v0.7.1+commit.f4a555be"`` |
| `0.7.2` | ``"v0.7.2+commit.51b20bc0"`` |
| `0.7.3` | ``"v0.7.3+commit.9bfce1f6"`` |
| `0.7.4` | ``"v0.7.4+commit.3f05b770"`` |
| `0.7.5` | ``"v0.7.5+commit.eb77ed08"`` |
| `0.7.6` | ``"v0.7.6+commit.7338295f"`` |
| `0.8.0` | ``"v0.8.0+commit.c7dfd78e"`` |
| `0.8.1` | ``"v0.8.1+commit.df193b15"`` |
| `0.8.10` | ``"v0.8.10+commit.fc410830"`` |
| `0.8.11` | ``"v0.8.11+commit.d7f03943"`` |
| `0.8.12` | ``"v0.8.12+commit.f00d7308"`` |
| `0.8.13` | ``"v0.8.13+commit.abaa5c0e"`` |
| `0.8.14` | ``"v0.8.14+commit.80d49f37"`` |
| `0.8.15` | ``"v0.8.15+commit.e14f2714"`` |
| `0.8.16` | ``"v0.8.16+commit.07a7930e"`` |
| `0.8.17` | ``"v0.8.17+commit.8df45f5f"`` |
| `0.8.18` | ``"v0.8.18+commit.87f61d96"`` |
| `0.8.19` | ``"v0.8.19+commit.7dd6d404"`` |
| `0.8.2` | ``"v0.8.2+commit.661d1103"`` |
| `0.8.20` | ``"v0.8.20+commit.a1b79de6"`` |
| `0.8.21` | ``"v0.8.21+commit.d9974bed"`` |
| `0.8.22` | ``"v0.8.22+commit.4fc1097e"`` |
| `0.8.23` | ``"v0.8.23+commit.f704f362"`` |
| `0.8.3` | ``"v0.8.3+commit.8d00100c"`` |
| `0.8.4` | ``"v0.8.4+commit.c7e474f2"`` |
| `0.8.5` | ``"v0.8.5+commit.a4f2e591"`` |
| `0.8.6` | ``"v0.8.6+commit.11564f7e"`` |
| `0.8.7` | ``"v0.8.7+commit.e28d00a7"`` |
| `0.8.8` | ``"v0.8.8+commit.dddeac2f"`` |
| `0.8.9` | ``"v0.8.9+commit.e5eed63a"`` |

#### Defined in

[solcTypes.ts:642](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L642)

___

### SolcBytecodeOutput

Ƭ **SolcBytecodeOutput**: \{ `functionDebugData`: \{ `[functionName: string]`: [`SolcFunctionDebugData`](modules.md#solcfunctiondebugdata);  } ; `generatedSources`: [`SolcGeneratedSource`](modules.md#solcgeneratedsource)[] ; `linkReferences`: \{ `[fileName: string]`: \{ `[libraryName: string]`: \{ `length`: `number` ; `start`: `number`  }[];  };  } ; `object`: `string` ; `opcodes`: `string` ; `sourceMap`: `string`  } & `Omit`\<[`SolcDeployedBytecodeOutput`](modules.md#solcdeployedbytecodeoutput), ``"immutableReferences"``\>

#### Defined in

[solcTypes.ts:459](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L459)

___

### SolcContractOutput

Ƭ **SolcContractOutput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `abi` | `Abi` |
| `devdoc` | `any` |
| `evm` | [`SolcEVMOutput`](modules.md#solcevmoutput) |
| `ewasm` | [`SolcEwasmOutput`](modules.md#solcewasmoutput) |
| `ir` | `string` |
| `metadata` | `string` |
| `storageLayout` | \{ `storage`: `any`[] ; `types`: `any`  } |
| `storageLayout.storage` | `any`[] |
| `storageLayout.types` | `any` |
| `userdoc` | \{ `kind`: ``"user"`` ; `methods?`: `Record`\<`string`, \{ `notice`: `string`  }\> ; `notice?`: `string` ; `version`: `number`  } |
| `userdoc.kind` | ``"user"`` |
| `userdoc.methods?` | `Record`\<`string`, \{ `notice`: `string`  }\> |
| `userdoc.notice?` | `string` |
| `userdoc.version` | `number` |

#### Defined in

[solcTypes.ts:403](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L403)

___

### SolcDebugSettings

Ƭ **SolcDebugSettings**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `debugInfo?` | (``"location"`` \| ``"snippet"`` \| ``"*"``)[] |
| `revertStrings?` | ``"default"`` \| ``"strip"`` \| ``"debug"`` \| ``"verboseDebug"`` |

#### Defined in

[solcTypes.ts:204](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L204)

___

### SolcDeployedBytecodeOutput

Ƭ **SolcDeployedBytecodeOutput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `immutableReferences` | \{ `[astID: string]`: \{ `length`: `number` ; `start`: `number`  }[];  } |

#### Defined in

[solcTypes.ts:485](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L485)

___

### SolcEVMOutput

Ƭ **SolcEVMOutput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `assembly` | `string` |
| `bytecode` | [`SolcBytecodeOutput`](modules.md#solcbytecodeoutput) |
| `deployedBytecode` | [`SolcBytecodeOutput`](modules.md#solcbytecodeoutput) |
| `gasEstimates` | [`SolcGasEstimates`](modules.md#solcgasestimates) |
| `legacyAssembly` | `any` |
| `methodIdentifiers` | \{ `[functionSignature: string]`: `string`;  } |

#### Defined in

[solcTypes.ts:437](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L437)

___

### SolcErrorEntry

Ƭ **SolcErrorEntry**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `component` | `string` |
| `errorCode?` | `string` |
| `formattedMessage?` | `string` |
| `message` | `string` |
| `secondarySourceLocations?` | [`SolcSecondarySourceLocation`](modules.md#solcsecondarysourcelocation)[] |
| `severity` | ``"error"`` \| ``"warning"`` \| ``"info"`` |
| `sourceLocation?` | [`SolcSourceLocation`](modules.md#solcsourcelocation) |
| `type` | `string` |

#### Defined in

[solcTypes.ts:359](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L359)

___

### SolcEwasmOutput

Ƭ **SolcEwasmOutput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `wasm` | `string` |
| `wast` | `string` |

#### Defined in

[solcTypes.ts:527](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L527)

___

### SolcFunctionDebugData

Ƭ **SolcFunctionDebugData**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `entryPoint?` | `number` |
| `id?` | `number` \| ``null`` |
| `parameterSlots?` | `number` |
| `returnSlots?` | `number` |

#### Defined in

[solcTypes.ts:492](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L492)

___

### SolcGasEstimates

Ƭ **SolcGasEstimates**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `creation` | \{ `codeDepositCost`: `string` ; `executionCost`: `string` ; `totalCost`: `string`  } |
| `creation.codeDepositCost` | `string` |
| `creation.executionCost` | `string` |
| `creation.totalCost` | `string` |
| `external` | \{ `[functionSignature: string]`: `string`;  } |
| `internal` | \{ `[functionSignature: string]`: `string`;  } |

#### Defined in

[solcTypes.ts:512](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L512)

___

### SolcGeneratedSource

Ƭ **SolcGeneratedSource**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `ast` | `any` |
| `contents` | `string` |
| `id` | `number` |
| `language` | `string` |
| `name` | `string` |

#### Defined in

[solcTypes.ts:499](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L499)

___

### SolcInputDescription

Ƭ **SolcInputDescription**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `language` | [`SolcLanguage`](modules.md#solclanguage) |
| `settings?` | [`SolcSettings`](modules.md#solcsettings) |
| `sources` | [`SolcInputSources`](modules.md#solcinputsources) |

#### Defined in

[solcTypes.ts:332](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L332)

___

### SolcInputSource

Ƭ **SolcInputSource**: \{ `ast?`: `SolcAst` ; `keccak256?`: `HexNumber`  } & \{ `urls`: `string`[]  } \| \{ `content`: `string`  }

#### Defined in

[solcTypes.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L15)

___

### SolcInputSources

Ƭ **SolcInputSources**: `Object`

#### Index signature

▪ [globalName: `string`]: [`SolcInputSource`](modules.md#solcinputsource) & \{ `destructible?`: [`SolcInputSourcesDestructibleSettings`](modules.md#solcinputsourcesdestructiblesettings)  }

#### Defined in

[solcTypes.ts:326](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L326)

___

### SolcInputSourcesDestructibleSettings

Ƭ **SolcInputSourcesDestructibleSettings**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `content` | `string` |
| `keccak256?` | `HexNumber` |

#### Defined in

[solcTypes.ts:319](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L319)

___

### SolcLanguage

Ƭ **SolcLanguage**: ``"Solidity"`` \| ``"Yul"`` \| ``"SolidityAST"``

#### Defined in

[solcTypes.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L11)

___

### SolcMetadataSettings

Ƭ **SolcMetadataSettings**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `appendCBOR?` | `boolean` |
| `bytecodeHash?` | ``"ipfs"`` \| ``"bzzr1"`` \| ``"none"`` |
| `useLiteralContent?` | `boolean` |

#### Defined in

[solcTypes.ts:225](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L225)

___

### SolcModelChecker

Ƭ **SolcModelChecker**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `contracts` | [`SolcModelCheckerContracts`](modules.md#solcmodelcheckercontracts) |
| `divModNoSlacks?` | `boolean` |
| `engine?` | ``"all"`` \| ``"bmc"`` \| ``"chc"`` \| ``"none"`` |
| `extCalls` | ``"trusted"`` \| ``"untrusted"`` |
| `invariants` | (``"contract"`` \| ``"reentrancy"``)[] |
| `showProved?` | `boolean` |
| `showUnproved?` | `boolean` |
| `showUnsupported?` | `boolean` |
| `solvers` | (``"cvc4"`` \| ``"smtlib2"`` \| ``"z3"``)[] |
| `targets?` | (``"underflow"`` \| ``"overflow"`` \| ``"assert"``)[] |
| `timeout?` | `boolean` |

#### Defined in

[solcTypes.ts:165](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L165)

___

### SolcModelCheckerContracts

Ƭ **SolcModelCheckerContracts**: `Object`

#### Index signature

▪ [fileName: \`$\{string}.sol\`]: `string`[]

#### Defined in

[solcTypes.ts:161](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L161)

___

### SolcOptimizer

Ƭ **SolcOptimizer**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `details` | [`SolcOptimizerDetails`](modules.md#solcoptimizerdetails) |
| `enabled?` | `boolean` |
| `runs` | `number` |

#### Defined in

[solcTypes.ts:106](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L106)

___

### SolcOptimizerDetails

Ƭ **SolcOptimizerDetails**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `constantOptimizer` | `boolean` |
| `cse` | `boolean` |
| `deduplicate` | `boolean` |
| `inliner` | `boolean` |
| `jumpdestRemover` | `boolean` |
| `orderLiterals` | `boolean` |
| `peephole` | `boolean` |
| `yul` | `boolean` |
| `yulDetails` | [`SolcYulDetails`](modules.md#solcyuldetails) |

#### Defined in

[solcTypes.ts:77](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L77)

___

### SolcOutput

Ƭ **SolcOutput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `contracts` | \{ `[sourceFile: string]`: \{ `[contractName: string]`: [`SolcContractOutput`](modules.md#solccontractoutput);  };  } |
| `errors?` | [`SolcErrorEntry`](modules.md#solcerrorentry)[] |
| `sources` | \{ `[sourceFile: string]`: [`SolcSourceEntry`](modules.md#solcsourceentry);  } |

#### Defined in

[solcTypes.ts:339](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L339)

___

### SolcOutputSelection

Ƭ **SolcOutputSelection**: `Object`

#### Index signature

▪ [fileName: `string`]: \{ `?`: ``"ast"``[]  } & \{ `[contractName: Exclude<string, typeof fileLevelOption>]`: (``"abi"`` \| ``"ast"`` \| ``"devdoc"`` \| ``"evm.assembly"`` \| ``"evm.bytecode"`` \| ``"evm.bytecode.functionDebugData"`` \| ``"evm.bytecode.generatedSources"`` \| ``"evm.bytecode.linkReferences"`` \| ``"evm.bytecode.object"`` \| ``"evm.bytecode.opcodes"`` \| ``"evm.bytecode.sourceMap"`` \| ``"evm.deployedBytecode"`` \| ``"evm.deployedBytecode.immutableReferences"`` \| ``"evm.deployedBytecode.sourceMap"`` \| ``"evm.deployedBytecode.opcodes"`` \| ``"evm.deployedBytecode.object"`` \| ``"evm.gasEstimates"`` \| ``"evm.methodIdentifiers"`` \| ``"evm.legacyAssembly"`` \| ``"evm.methodIdentifiers"`` \| ``"evm.storageLayout"`` \| ``"ewasm.wasm"`` \| ``"ewasm.wast"`` \| ``"ir"`` \| ``"irOptimized"`` \| ``"metadata"`` \| ``"storageLayout"`` \| ``"userdoc"`` \| ``"*"``)[];  }

#### Defined in

[solcTypes.ts:121](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L121)

___

### SolcRemapping

Ƭ **SolcRemapping**: \`$\{string}=$\{string}\`[]

#### Defined in

[solcTypes.ts:52](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L52)

___

### SolcSecondarySourceLocation

Ƭ **SolcSecondarySourceLocation**: [`SolcSourceLocation`](modules.md#solcsourcelocation) & \{ `message`: `string`  }

#### Defined in

[solcTypes.ts:391](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L391)

___

### SolcSettings

Ƭ **SolcSettings**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `debug?` | [`SolcDebugSettings`](modules.md#solcdebugsettings) |
| `evmVersion?` | ``"byzantium"`` \| ``"constantinople"`` \| ``"petersburg"`` \| ``"istanbul"`` \| ``"berlin"`` \| ``"london"`` \| ``"paris"`` |
| `libraries?` | `Record`\<`string`, `Record`\<`string`, `string`\>\> |
| `metadata?` | [`SolcMetadataSettings`](modules.md#solcmetadatasettings) |
| `modelChecker?` | [`SolcModelChecker`](modules.md#solcmodelchecker) |
| `optimizer?` | [`SolcOptimizer`](modules.md#solcoptimizer) |
| `outputSelection` | [`SolcOutputSelection`](modules.md#solcoutputselection) |
| `remappings?` | [`SolcRemapping`](modules.md#solcremapping) |
| `stopAfter?` | ``"parsing"`` |
| `viaIR?` | `boolean` |

#### Defined in

[solcTypes.ts:239](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L239)

___

### SolcSourceEntry

Ƭ **SolcSourceEntry**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `ast` | `any` |
| `id` | `number` |

#### Defined in

[solcTypes.ts:395](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L395)

___

### SolcSourceLocation

Ƭ **SolcSourceLocation**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `end` | `number` |
| `file` | `string` |
| `start` | `number` |

#### Defined in

[solcTypes.ts:385](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L385)

___

### SolcVersions

Ƭ **SolcVersions**: ``"0.8.23"`` \| ``"0.8.22"`` \| ``"0.8.21"`` \| ``"0.8.20"`` \| ``"0.8.19"`` \| ``"0.8.18"`` \| ``"0.8.17"`` \| ``"0.8.16"`` \| ``"0.8.15"`` \| ``"0.8.14"`` \| ``"0.8.13"`` \| ``"0.8.12"`` \| ``"0.8.11"`` \| ``"0.8.10"`` \| ``"0.8.9"`` \| ``"0.8.8"`` \| ``"0.8.7"`` \| ``"0.8.6"`` \| ``"0.8.5"`` \| ``"0.8.4"`` \| ``"0.8.3"`` \| ``"0.8.2"`` \| ``"0.8.1"`` \| ``"0.8.0"`` \| ``"0.7.6"`` \| ``"0.7.5"`` \| ``"0.7.4"`` \| ``"0.7.3"`` \| ``"0.7.2"`` \| ``"0.7.1"`` \| ``"0.7.0"`` \| ``"0.6.12"`` \| ``"0.6.11"`` \| ``"0.6.10"`` \| ``"0.6.9"`` \| ``"0.6.8"`` \| ``"0.6.7"`` \| ``"0.6.6"`` \| ``"0.6.5"`` \| ``"0.6.4"`` \| ``"0.6.3"`` \| ``"0.6.2"`` \| ``"0.6.1"`` \| ``"0.6.0"`` \| ``"0.5.17"`` \| ``"0.5.16"`` \| ``"0.5.15"`` \| ``"0.5.14"`` \| ``"0.5.13"`` \| ``"0.5.12"`` \| ``"0.5.11"`` \| ``"0.5.10"`` \| ``"0.5.9"`` \| ``"0.5.8"`` \| ``"0.5.7"`` \| ``"0.5.6"`` \| ``"0.5.5"`` \| ``"0.5.4"`` \| ``"0.5.3"`` \| ``"0.5.2"`` \| ``"0.5.1"`` \| ``"0.5.0"`` \| ``"0.4.26"`` \| ``"0.4.25"`` \| ``"0.4.24"`` \| ``"0.4.23"`` \| ``"0.4.22"`` \| ``"0.4.21"`` \| ``"0.4.20"`` \| ``"0.4.19"`` \| ``"0.4.18"`` \| ``"0.4.17"`` \| ``"0.4.16"`` \| ``"0.4.15"`` \| ``"0.4.14"`` \| ``"0.4.13"`` \| ``"0.4.12"`` \| ``"0.4.11"`` \| ``"0.4.10"`` \| ``"0.4.9"`` \| ``"0.4.8"`` \| ``"0.4.7"`` \| ``"0.4.6"`` \| ``"0.4.5"`` \| ``"0.4.4"`` \| ``"0.4.3"`` \| ``"0.4.2"`` \| ``"0.4.1"`` \| ``"0.4.0"`` \| ``"0.3.6"`` \| ``"0.3.5"`` \| ``"0.3.4"`` \| ``"0.3.3"`` \| ``"0.3.2"`` \| ``"0.3.1"`` \| ``"0.3.0"`` \| ``"0.2.2"`` \| ``"0.2.1"`` \| ``"0.2.0"`` \| ``"0.1.7"`` \| ``"0.1.6"`` \| ``"0.1.5"`` \| ``"0.1.4"`` \| ``"0.1.3"`` \| ``"0.1.2"`` \| ``"0.1.1"``

#### Defined in

[solcTypes.ts:534](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L534)

___

### SolcYulDetails

Ƭ **SolcYulDetails**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `optimizerSteps` | `string` |
| `stackAllocation?` | `boolean` |

#### Defined in

[solcTypes.ts:55](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L55)

## Variables

### releases

• `Const` **releases**: [`Releases`](modules.md#releases)

#### Defined in

[solc.js:12](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solc.js#L12)

## Functions

### createSolc

▸ **createSolc**(`release`): `Promise`\<[`Solc`](interfaces/Solc.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `release` | keyof [`Releases`](modules.md#releases) |

#### Returns

`Promise`\<[`Solc`](interfaces/Solc.md)\>

An instance of solc

#### Defined in

[solc.js:135](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solc.js#L135)

___

### solcCompile

▸ **solcCompile**(`solc`, `input`): [`SolcOutput`](modules.md#solcoutput)

Typesafe wrapper around solc.compile

#### Parameters

| Name | Type |
| :------ | :------ |
| `solc` | `any` |
| `input` | [`SolcInputDescription`](modules.md#solcinputdescription) |

#### Returns

[`SolcOutput`](modules.md#solcoutput)

#### Defined in

[solc.js:127](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solc.js#L127)
