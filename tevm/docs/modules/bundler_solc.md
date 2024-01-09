[tevm](../README.md) / [Modules](../modules.md) / bundler/solc

# Module: bundler/solc

## Table of contents

### Type Aliases

- [SolcBytecodeOutput](bundler_solc.md#solcbytecodeoutput)
- [SolcContractOutput](bundler_solc.md#solccontractoutput)
- [SolcDebugSettings](bundler_solc.md#solcdebugsettings)
- [SolcDeployedBytecodeOutput](bundler_solc.md#solcdeployedbytecodeoutput)
- [SolcEVMOutput](bundler_solc.md#solcevmoutput)
- [SolcErrorEntry](bundler_solc.md#solcerrorentry)
- [SolcEwasmOutput](bundler_solc.md#solcewasmoutput)
- [SolcFunctionDebugData](bundler_solc.md#solcfunctiondebugdata)
- [SolcGasEstimates](bundler_solc.md#solcgasestimates)
- [SolcInputDescription](bundler_solc.md#solcinputdescription)
- [SolcInputSource](bundler_solc.md#solcinputsource)
- [SolcInputSources](bundler_solc.md#solcinputsources)
- [SolcInputSourcesDestructibleSettings](bundler_solc.md#solcinputsourcesdestructiblesettings)
- [SolcLanguage](bundler_solc.md#solclanguage)
- [SolcModelChecker](bundler_solc.md#solcmodelchecker)
- [SolcModelCheckerContracts](bundler_solc.md#solcmodelcheckercontracts)
- [SolcOptimizer](bundler_solc.md#solcoptimizer)
- [SolcOptimizerDetails](bundler_solc.md#solcoptimizerdetails)
- [SolcOutput](bundler_solc.md#solcoutput)
- [SolcOutputSelection](bundler_solc.md#solcoutputselection)
- [SolcRemapping](bundler_solc.md#solcremapping)
- [SolcSecondarySourceLocation](bundler_solc.md#solcsecondarysourcelocation)
- [SolcSettings](bundler_solc.md#solcsettings)
- [SolcSourceEntry](bundler_solc.md#solcsourceentry)
- [SolcSourceLocation](bundler_solc.md#solcsourcelocation)
- [SolcVersions](bundler_solc.md#solcversions)
- [SolcYulDetails](bundler_solc.md#solcyuldetails)

### Variables

- [releases](bundler_solc.md#releases)

### Functions

- [createSolc](bundler_solc.md#createsolc)
- [solcCompile](bundler_solc.md#solccompile)

## Type Aliases

### SolcBytecodeOutput

Ƭ **SolcBytecodeOutput**: `SolcBytecodeOutput$1`

./solcTypes.ts

#### Defined in

bundler/solc/dist/index.d.ts:413

___

### SolcContractOutput

Ƭ **SolcContractOutput**: `SolcContractOutput$1`

./solcTypes.ts

#### Defined in

bundler/solc/dist/index.d.ts:417

___

### SolcDebugSettings

Ƭ **SolcDebugSettings**: `SolcDebugSettings$1`

./solcTypes.ts

#### Defined in

bundler/solc/dist/index.d.ts:409

___

### SolcDeployedBytecodeOutput

Ƭ **SolcDeployedBytecodeOutput**: `SolcDeployedBytecodeOutput$1`

./solcTypes.ts

#### Defined in

bundler/solc/dist/index.d.ts:449

___

### SolcEVMOutput

Ƭ **SolcEVMOutput**: `SolcEVMOutput$1`

./solcTypes.ts

#### Defined in

bundler/solc/dist/index.d.ts:365

___

### SolcErrorEntry

Ƭ **SolcErrorEntry**: `SolcErrorEntry$1`

./solcTypes.ts

#### Defined in

bundler/solc/dist/index.d.ts:377

___

### SolcEwasmOutput

Ƭ **SolcEwasmOutput**: `SolcEwasmOutput$1`

./solcTypes.ts

#### Defined in

bundler/solc/dist/index.d.ts:385

___

### SolcFunctionDebugData

Ƭ **SolcFunctionDebugData**: `SolcFunctionDebugData$1`

./solcTypes.ts

#### Defined in

bundler/solc/dist/index.d.ts:441

___

### SolcGasEstimates

Ƭ **SolcGasEstimates**: `SolcGasEstimates$1`

./solcTypes.ts

#### Defined in

bundler/solc/dist/index.d.ts:397

___

### SolcInputDescription

Ƭ **SolcInputDescription**: `SolcInputDescription$1`

./solcTypes.ts

#### Defined in

bundler/solc/dist/index.d.ts:429

___

### SolcInputSource

Ƭ **SolcInputSource**: `SolcInputSource$1`

./solcTypes.ts

#### Defined in

bundler/solc/dist/index.d.ts:389

___

### SolcInputSources

Ƭ **SolcInputSources**: `SolcInputSources$1`

./solcTypes.ts

#### Defined in

bundler/solc/dist/index.d.ts:401

___

### SolcInputSourcesDestructibleSettings

Ƭ **SolcInputSourcesDestructibleSettings**: `SolcInputSourcesDestructibleSettings$1`

./solcTypes.ts

#### Defined in

bundler/solc/dist/index.d.ts:457

___

### SolcLanguage

Ƭ **SolcLanguage**: `SolcLanguage$1`

./solcTypes.ts

#### Defined in

bundler/solc/dist/index.d.ts:357

___

### SolcModelChecker

Ƭ **SolcModelChecker**: `SolcModelChecker$1`

./solcTypes.ts

#### Defined in

bundler/solc/dist/index.d.ts:405

___

### SolcModelCheckerContracts

Ƭ **SolcModelCheckerContracts**: `SolcModelCheckerContracts$1`

./solcTypes.ts

#### Defined in

bundler/solc/dist/index.d.ts:445

___

### SolcOptimizer

Ƭ **SolcOptimizer**: `SolcOptimizer$1`

./solcTypes.ts

#### Defined in

bundler/solc/dist/index.d.ts:369

___

### SolcOptimizerDetails

Ƭ **SolcOptimizerDetails**: `SolcOptimizerDetails$1`

./solcTypes.ts

#### Defined in

bundler/solc/dist/index.d.ts:437

___

### SolcOutput

Ƭ **SolcOutput**: `SolcOutput$1`

./solcTypes.ts

#### Defined in

bundler/solc/dist/index.d.ts:353

___

### SolcOutputSelection

Ƭ **SolcOutputSelection**: `SolcOutputSelection$1`

./solcTypes.ts

#### Defined in

bundler/solc/dist/index.d.ts:425

___

### SolcRemapping

Ƭ **SolcRemapping**: `SolcRemapping$1`

./solcTypes.ts

#### Defined in

bundler/solc/dist/index.d.ts:373

___

### SolcSecondarySourceLocation

Ƭ **SolcSecondarySourceLocation**: `SolcSecondarySourceLocation$1`

./solcTypes.ts

#### Defined in

bundler/solc/dist/index.d.ts:453

___

### SolcSettings

Ƭ **SolcSettings**: `SolcSettings$1`

./solcTypes.ts

#### Defined in

bundler/solc/dist/index.d.ts:361

___

### SolcSourceEntry

Ƭ **SolcSourceEntry**: `SolcSourceEntry$1`

./solcTypes.ts

#### Defined in

bundler/solc/dist/index.d.ts:393

___

### SolcSourceLocation

Ƭ **SolcSourceLocation**: `SolcSourceLocation$1`

./solcTypes.ts

#### Defined in

bundler/solc/dist/index.d.ts:421

___

### SolcVersions

Ƭ **SolcVersions**: `SolcVersions$1`

./solcTypes.ts

#### Defined in

bundler/solc/dist/index.d.ts:469

___

### SolcYulDetails

Ƭ **SolcYulDetails**: `SolcYulDetails$1`

./solcTypes.ts

#### Defined in

bundler/solc/dist/index.d.ts:381

## Variables

### releases

• `Const` **releases**: `Releases$1`

#### Defined in

bundler/solc/dist/index.d.ts:346

## Functions

### createSolc

▸ **createSolc**(`release`): `Promise`\<`Solc$1`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `release` | keyof `Releases$1` |

#### Returns

`Promise`\<`Solc$1`\>

#### Defined in

bundler/solc/dist/index.d.ts:348

___

### solcCompile

▸ **solcCompile**(`solc`, `input`): `SolcOutput$1`

#### Parameters

| Name | Type |
| :------ | :------ |
| `solc` | `any` |
| `input` | `SolcInputDescription$1` |

#### Returns

`SolcOutput$1`

#### Defined in

bundler/solc/dist/index.d.ts:347
