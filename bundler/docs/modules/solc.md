[@tevm/bundler](../README.md) / [Modules](../modules.md) / solc

# Module: solc

## Table of contents

### Type Aliases

- [SolcBytecodeOutput](solc.md#solcbytecodeoutput)
- [SolcContractOutput](solc.md#solccontractoutput)
- [SolcDebugSettings](solc.md#solcdebugsettings)
- [SolcDeployedBytecodeOutput](solc.md#solcdeployedbytecodeoutput)
- [SolcEVMOutput](solc.md#solcevmoutput)
- [SolcErrorEntry](solc.md#solcerrorentry)
- [SolcEwasmOutput](solc.md#solcewasmoutput)
- [SolcFunctionDebugData](solc.md#solcfunctiondebugdata)
- [SolcGasEstimates](solc.md#solcgasestimates)
- [SolcInputDescription](solc.md#solcinputdescription)
- [SolcInputSource](solc.md#solcinputsource)
- [SolcInputSources](solc.md#solcinputsources)
- [SolcInputSourcesDestructibleSettings](solc.md#solcinputsourcesdestructiblesettings)
- [SolcLanguage](solc.md#solclanguage)
- [SolcModelChecker](solc.md#solcmodelchecker)
- [SolcModelCheckerContracts](solc.md#solcmodelcheckercontracts)
- [SolcOptimizer](solc.md#solcoptimizer)
- [SolcOptimizerDetails](solc.md#solcoptimizerdetails)
- [SolcOutput](solc.md#solcoutput)
- [SolcOutputSelection](solc.md#solcoutputselection)
- [SolcRemapping](solc.md#solcremapping)
- [SolcSecondarySourceLocation](solc.md#solcsecondarysourcelocation)
- [SolcSettings](solc.md#solcsettings)
- [SolcSourceEntry](solc.md#solcsourceentry)
- [SolcSourceLocation](solc.md#solcsourcelocation)
- [SolcVersions](solc.md#solcversions)
- [SolcYulDetails](solc.md#solcyuldetails)

### Variables

- [releases](solc.md#releases)

### Functions

- [createSolc](solc.md#createsolc)
- [solcCompile](solc.md#solccompile)

## Type Aliases

### SolcBytecodeOutput

Ƭ **SolcBytecodeOutput**: \{ `functionDebugData`: \{ `[functionName: string]`: [`SolcFunctionDebugData`](solc.md#solcfunctiondebugdata);  } ; `generatedSources`: `SolcGeneratedSource`[] ; `linkReferences`: \{ `[fileName: string]`: \{ `[libraryName: string]`: \{ `length`: `number` ; `start`: `number`  }[];  };  } ; `object`: `string` ; `opcodes`: `string` ; `sourceMap`: `string`  } & `Omit`\<[`SolcDeployedBytecodeOutput`](solc.md#solcdeployedbytecodeoutput), ``"immutableReferences"``\>

#### Defined in

bundler-packages/solc/types/src/solcTypes.d.ts:156

___

### SolcContractOutput

Ƭ **SolcContractOutput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `abi` | `Abi` |
| `devdoc` | `any` |
| `evm` | [`SolcEVMOutput`](solc.md#solcevmoutput) |
| `ewasm` | [`SolcEwasmOutput`](solc.md#solcewasmoutput) |
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

bundler-packages/solc/types/src/solcTypes.d.ts:126

___

### SolcDebugSettings

Ƭ **SolcDebugSettings**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `debugInfo?` | (``"location"`` \| ``"snippet"`` \| ``"*"``)[] |
| `revertStrings?` | ``"default"`` \| ``"strip"`` \| ``"debug"`` \| ``"verboseDebug"`` |

#### Defined in

bundler-packages/solc/types/src/solcTypes.d.ts:58

___

### SolcDeployedBytecodeOutput

Ƭ **SolcDeployedBytecodeOutput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `immutableReferences` | \{ `[astID: string]`: \{ `length`: `number` ; `start`: `number`  }[];  } |

#### Defined in

bundler-packages/solc/types/src/solcTypes.d.ts:173

___

### SolcEVMOutput

Ƭ **SolcEVMOutput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `assembly` | `string` |
| `bytecode` | [`SolcBytecodeOutput`](solc.md#solcbytecodeoutput) |
| `deployedBytecode` | [`SolcBytecodeOutput`](solc.md#solcbytecodeoutput) |
| `gasEstimates` | [`SolcGasEstimates`](solc.md#solcgasestimates) |
| `legacyAssembly` | `any` |
| `methodIdentifiers` | \{ `[functionSignature: string]`: `string`;  } |

#### Defined in

bundler-packages/solc/types/src/solcTypes.d.ts:146

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
| `secondarySourceLocations?` | [`SolcSecondarySourceLocation`](solc.md#solcsecondarysourcelocation)[] |
| `severity` | ``"error"`` \| ``"warning"`` \| ``"info"`` |
| `sourceLocation?` | [`SolcSourceLocation`](solc.md#solcsourcelocation) |
| `type` | `string` |

#### Defined in

bundler-packages/solc/types/src/solcTypes.d.ts:104

___

### SolcEwasmOutput

Ƭ **SolcEwasmOutput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `wasm` | `string` |
| `wast` | `string` |

#### Defined in

bundler-packages/solc/types/src/solcTypes.d.ts:207

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

bundler-packages/solc/types/src/solcTypes.d.ts:181

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

bundler-packages/solc/types/src/solcTypes.d.ts:194

___

### SolcInputDescription

Ƭ **SolcInputDescription**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `language` | [`SolcLanguage`](solc.md#solclanguage) |
| `settings?` | [`SolcSettings`](solc.md#solcsettings) |
| `sources` | [`SolcInputSources`](solc.md#solcinputsources) |

#### Defined in

bundler-packages/solc/types/src/solcTypes.d.ts:88

___

### SolcInputSource

Ƭ **SolcInputSource**: \{ `ast?`: `SolcAst` ; `keccak256?`: `HexNumber`  } & \{ `urls`: `string`[]  } \| \{ `content`: `string`  }

#### Defined in

bundler-packages/solc/types/src/solcTypes.d.ts:5

___

### SolcInputSources

Ƭ **SolcInputSources**: `Object`

#### Index signature

▪ [globalName: `string`]: [`SolcInputSource`](solc.md#solcinputsource) & \{ `destructible?`: [`SolcInputSourcesDestructibleSettings`](solc.md#solcinputsourcesdestructiblesettings)  }

#### Defined in

bundler-packages/solc/types/src/solcTypes.d.ts:83

___

### SolcInputSourcesDestructibleSettings

Ƭ **SolcInputSourcesDestructibleSettings**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `content` | `string` |
| `keccak256?` | `HexNumber` |

#### Defined in

bundler-packages/solc/types/src/solcTypes.d.ts:79

___

### SolcLanguage

Ƭ **SolcLanguage**: ``"Solidity"`` \| ``"Yul"`` \| ``"SolidityAST"``

#### Defined in

bundler-packages/solc/types/src/solcTypes.d.ts:4

___

### SolcModelChecker

Ƭ **SolcModelChecker**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `contracts` | [`SolcModelCheckerContracts`](solc.md#solcmodelcheckercontracts) |
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

bundler-packages/solc/types/src/solcTypes.d.ts:45

___

### SolcModelCheckerContracts

Ƭ **SolcModelCheckerContracts**: `Object`

#### Index signature

▪ [fileName: \`$\{string}.sol\`]: `string`[]

#### Defined in

bundler-packages/solc/types/src/solcTypes.d.ts:42

___

### SolcOptimizer

Ƭ **SolcOptimizer**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `details` | [`SolcOptimizerDetails`](solc.md#solcoptimizerdetails) |
| `enabled?` | `boolean` |
| `runs` | `number` |

#### Defined in

bundler-packages/solc/types/src/solcTypes.d.ts:29

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
| `yulDetails` | [`SolcYulDetails`](solc.md#solcyuldetails) |

#### Defined in

bundler-packages/solc/types/src/solcTypes.d.ts:18

___

### SolcOutput

Ƭ **SolcOutput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `contracts` | \{ `[sourceFile: string]`: \{ `[contractName: string]`: [`SolcContractOutput`](solc.md#solccontractoutput);  };  } |
| `errors?` | [`SolcErrorEntry`](solc.md#solcerrorentry)[] |
| `sources` | \{ `[sourceFile: string]`: [`SolcSourceEntry`](solc.md#solcsourceentry);  } |

#### Defined in

bundler-packages/solc/types/src/solcTypes.d.ts:93

___

### SolcOutputSelection

Ƭ **SolcOutputSelection**: `Object`

#### Index signature

▪ [fileName: `string`]: \{ `?`: ``"ast"``[]  } & \{ `[contractName: Exclude<string, typeof fileLevelOption>]`: (``"abi"`` \| ``"ast"`` \| ``"devdoc"`` \| ``"evm.assembly"`` \| ``"evm.bytecode"`` \| ``"evm.bytecode.functionDebugData"`` \| ``"evm.bytecode.generatedSources"`` \| ``"evm.bytecode.linkReferences"`` \| ``"evm.bytecode.object"`` \| ``"evm.bytecode.opcodes"`` \| ``"evm.bytecode.sourceMap"`` \| ``"evm.deployedBytecode"`` \| ``"evm.deployedBytecode.immutableReferences"`` \| ``"evm.deployedBytecode.sourceMap"`` \| ``"evm.deployedBytecode.opcodes"`` \| ``"evm.deployedBytecode.object"`` \| ``"evm.gasEstimates"`` \| ``"evm.methodIdentifiers"`` \| ``"evm.legacyAssembly"`` \| ``"evm.methodIdentifiers"`` \| ``"evm.storageLayout"`` \| ``"ewasm.wasm"`` \| ``"ewasm.wast"`` \| ``"ir"`` \| ``"irOptimized"`` \| ``"metadata"`` \| ``"storageLayout"`` \| ``"userdoc"`` \| ``"*"``)[];  }

#### Defined in

bundler-packages/solc/types/src/solcTypes.d.ts:35

___

### SolcRemapping

Ƭ **SolcRemapping**: \`$\{string}=$\{string}\`[]

#### Defined in

bundler-packages/solc/types/src/solcTypes.d.ts:13

___

### SolcSecondarySourceLocation

Ƭ **SolcSecondarySourceLocation**: [`SolcSourceLocation`](solc.md#solcsourcelocation) & \{ `message`: `string`  }

#### Defined in

bundler-packages/solc/types/src/solcTypes.d.ts:119

___

### SolcSettings

Ƭ **SolcSettings**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `debug?` | [`SolcDebugSettings`](solc.md#solcdebugsettings) |
| `evmVersion?` | ``"byzantium"`` \| ``"constantinople"`` \| ``"petersburg"`` \| ``"istanbul"`` \| ``"berlin"`` \| ``"london"`` \| ``"paris"`` |
| `libraries?` | `Record`\<`string`, `Record`\<`string`, `string`\>\> |
| `metadata?` | `SolcMetadataSettings` |
| `modelChecker?` | [`SolcModelChecker`](solc.md#solcmodelchecker) |
| `optimizer?` | [`SolcOptimizer`](solc.md#solcoptimizer) |
| `outputSelection` | [`SolcOutputSelection`](solc.md#solcoutputselection) |
| `remappings?` | [`SolcRemapping`](solc.md#solcremapping) |
| `stopAfter?` | ``"parsing"`` |
| `viaIR?` | `boolean` |

#### Defined in

bundler-packages/solc/types/src/solcTypes.d.ts:67

___

### SolcSourceEntry

Ƭ **SolcSourceEntry**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `ast` | `any` |
| `id` | `number` |

#### Defined in

bundler-packages/solc/types/src/solcTypes.d.ts:122

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

bundler-packages/solc/types/src/solcTypes.d.ts:114

___

### SolcVersions

Ƭ **SolcVersions**: ``"0.8.23"`` \| ``"0.8.22"`` \| ``"0.8.21"`` \| ``"0.8.20"`` \| ``"0.8.19"`` \| ``"0.8.18"`` \| ``"0.8.17"`` \| ``"0.8.16"`` \| ``"0.8.15"`` \| ``"0.8.14"`` \| ``"0.8.13"`` \| ``"0.8.12"`` \| ``"0.8.11"`` \| ``"0.8.10"`` \| ``"0.8.9"`` \| ``"0.8.8"`` \| ``"0.8.7"`` \| ``"0.8.6"`` \| ``"0.8.5"`` \| ``"0.8.4"`` \| ``"0.8.3"`` \| ``"0.8.2"`` \| ``"0.8.1"`` \| ``"0.8.0"`` \| ``"0.7.6"`` \| ``"0.7.5"`` \| ``"0.7.4"`` \| ``"0.7.3"`` \| ``"0.7.2"`` \| ``"0.7.1"`` \| ``"0.7.0"`` \| ``"0.6.12"`` \| ``"0.6.11"`` \| ``"0.6.10"`` \| ``"0.6.9"`` \| ``"0.6.8"`` \| ``"0.6.7"`` \| ``"0.6.6"`` \| ``"0.6.5"`` \| ``"0.6.4"`` \| ``"0.6.3"`` \| ``"0.6.2"`` \| ``"0.6.1"`` \| ``"0.6.0"`` \| ``"0.5.17"`` \| ``"0.5.16"`` \| ``"0.5.15"`` \| ``"0.5.14"`` \| ``"0.5.13"`` \| ``"0.5.12"`` \| ``"0.5.11"`` \| ``"0.5.10"`` \| ``"0.5.9"`` \| ``"0.5.8"`` \| ``"0.5.7"`` \| ``"0.5.6"`` \| ``"0.5.5"`` \| ``"0.5.4"`` \| ``"0.5.3"`` \| ``"0.5.2"`` \| ``"0.5.1"`` \| ``"0.5.0"`` \| ``"0.4.26"`` \| ``"0.4.25"`` \| ``"0.4.24"`` \| ``"0.4.23"`` \| ``"0.4.22"`` \| ``"0.4.21"`` \| ``"0.4.20"`` \| ``"0.4.19"`` \| ``"0.4.18"`` \| ``"0.4.17"`` \| ``"0.4.16"`` \| ``"0.4.15"`` \| ``"0.4.14"`` \| ``"0.4.13"`` \| ``"0.4.12"`` \| ``"0.4.11"`` \| ``"0.4.10"`` \| ``"0.4.9"`` \| ``"0.4.8"`` \| ``"0.4.7"`` \| ``"0.4.6"`` \| ``"0.4.5"`` \| ``"0.4.4"`` \| ``"0.4.3"`` \| ``"0.4.2"`` \| ``"0.4.1"`` \| ``"0.4.0"`` \| ``"0.3.6"`` \| ``"0.3.5"`` \| ``"0.3.4"`` \| ``"0.3.3"`` \| ``"0.3.2"`` \| ``"0.3.1"`` \| ``"0.3.0"`` \| ``"0.2.2"`` \| ``"0.2.1"`` \| ``"0.2.0"`` \| ``"0.1.7"`` \| ``"0.1.6"`` \| ``"0.1.5"`` \| ``"0.1.4"`` \| ``"0.1.3"`` \| ``"0.1.2"`` \| ``"0.1.1"``

#### Defined in

bundler-packages/solc/types/src/solcTypes.d.ts:211

___

### SolcYulDetails

Ƭ **SolcYulDetails**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `optimizerSteps` | `string` |
| `stackAllocation?` | `boolean` |

#### Defined in

bundler-packages/solc/types/src/solcTypes.d.ts:14

## Variables

### releases

• `Const` **releases**: `Releases`

#### Defined in

bundler-packages/solc/types/src/solc.d.ts:8

## Functions

### createSolc

▸ **createSolc**(`release`): `Promise`\<`Solc`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `release` | keyof `Releases` |

#### Returns

`Promise`\<`Solc`\>

#### Defined in

bundler-packages/solc/types/src/solc.d.ts:10

___

### solcCompile

▸ **solcCompile**(`solc`, `input`): `SolcOutput`

#### Parameters

| Name | Type |
| :------ | :------ |
| `solc` | `any` |
| `input` | [`SolcInputDescription`](solc.md#solcinputdescription) |

#### Returns

`SolcOutput`

#### Defined in

bundler-packages/solc/types/src/solc.d.ts:9
