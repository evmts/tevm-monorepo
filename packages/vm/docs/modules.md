[@evmts/vm](README.md) / Exports

# @evmts/vm

## Table of contents

### Classes

- [EVMts](classes/EVMts.md)

### Type Aliases

- [CreateEVMOptions](modules.md#createevmoptions)
- [PutAccountParameters](modules.md#putaccountparameters)
- [PutContractCodeParameters](modules.md#putcontractcodeparameters)
- [RunCallParameters](modules.md#runcallparameters)
- [RunContractCallError](modules.md#runcontractcallerror)
- [RunContractCallParameters](modules.md#runcontractcallparameters)
- [RunContractCallResult](modules.md#runcontractcallresult)
- [RunScriptError](modules.md#runscripterror)
- [RunScriptParameters](modules.md#runscriptparameters)
- [RunScriptResult](modules.md#runscriptresult)

## Type Aliases

### CreateEVMOptions

Ƭ **CreateEVMOptions**: `Object`

Options for creating an EVMts instance

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fork?` | `ForkOptions` |

#### Defined in

[evmts.ts:44](https://github.com/evmts/evmts-monorepo/blob/main/packages/vm/src/evmts.ts#L44)

___

### PutAccountParameters

Ƭ **PutAccountParameters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `account` | `Address` |
| `balance?` | `bigint` |

#### Defined in

[actions/putAccount.ts:9](https://github.com/evmts/evmts-monorepo/blob/main/packages/vm/src/actions/putAccount.ts#L9)

___

### PutContractCodeParameters

Ƭ **PutContractCodeParameters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bytecode` | `Hex` |
| `contractAddress` | `Address` |

#### Defined in

[actions/putContractCode.ts:5](https://github.com/evmts/evmts-monorepo/blob/main/packages/vm/src/actions/putContractCode.ts#L5)

___

### RunCallParameters

Ƭ **RunCallParameters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `caller` | `Address` |
| `data` | `Hex` |
| `gasLimit?` | `bigint` |
| `origin` | `Address` |
| `to` | `Address` |
| `value?` | `bigint` |

#### Defined in

[actions/runCall.ts:5](https://github.com/evmts/evmts-monorepo/blob/main/packages/vm/src/actions/runCall.ts#L5)

___

### RunContractCallError

Ƭ **RunContractCallError**: `Error`

#### Defined in

[actions/runContractCall.ts:28](https://github.com/evmts/evmts-monorepo/blob/main/packages/vm/src/actions/runContractCall.ts#L28)

___

### RunContractCallParameters

Ƭ **RunContractCallParameters**\<`TAbi`, `TFunctionName`\>: `EncodeFunctionDataParameters`\<`TAbi`, `TFunctionName`\> & \{ `caller?`: `Address` ; `contractAddress`: `Address` ; `gasLimit?`: `bigint`  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `string` = `string` |

#### Defined in

[actions/runContractCall.ts:18](https://github.com/evmts/evmts-monorepo/blob/main/packages/vm/src/actions/runContractCall.ts#L18)

___

### RunContractCallResult

Ƭ **RunContractCallResult**\<`TAbi`, `TFunctionName`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `string` = `string` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data` | `DecodeFunctionResultReturnType`\<`TAbi`, `TFunctionName`\> |
| `gasUsed` | `BigInt` |
| `logs` | `Log`[] |

#### Defined in

[actions/runContractCall.ts:30](https://github.com/evmts/evmts-monorepo/blob/main/packages/vm/src/actions/runContractCall.ts#L30)

___

### RunScriptError

Ƭ **RunScriptError**: `Error`

#### Defined in

[actions/runScript.ts:20](https://github.com/evmts/evmts-monorepo/blob/main/packages/vm/src/actions/runScript.ts#L20)

___

### RunScriptParameters

Ƭ **RunScriptParameters**\<`TAbi`, `TFunctionName`\>: `EncodeFunctionDataParameters`\<`TAbi`, `TFunctionName`\> & \{ `bytecode`: `Hex` ; `caller?`: `Address`  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `string` = `string` |

#### Defined in

[actions/runScript.ts:11](https://github.com/evmts/evmts-monorepo/blob/main/packages/vm/src/actions/runScript.ts#L11)

___

### RunScriptResult

Ƭ **RunScriptResult**\<`TAbi`, `TFunctionName`\>: [`RunContractCallResult`](modules.md#runcontractcallresult)\<`TAbi`, `TFunctionName`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `string` = `string` |

#### Defined in

[actions/runScript.ts:22](https://github.com/evmts/evmts-monorepo/blob/main/packages/vm/src/actions/runScript.ts#L22)
