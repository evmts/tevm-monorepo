[@evmts/vm](README.md) / Exports

# @evmts/vm

## Table of contents

### Classes

- [EVMts](classes/EVMts.md)

### Type Aliases

- [CreateEVMOptions](modules.md#createevmoptions)
- [PutAccountAction](modules.md#putaccountaction)
- [PutContractCodeAction](modules.md#putcontractcodeaction)
- [RunCallAction](modules.md#runcallaction)
- [RunContractCallAction](modules.md#runcontractcallaction)
- [RunContractCallError](modules.md#runcontractcallerror)
- [RunContractCallResult](modules.md#runcontractcallresult)
- [RunScriptAction](modules.md#runscriptaction)
- [RunScriptError](modules.md#runscripterror)
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

[evmts.ts:42](https://github.com/evmts/evmts-monorepo/blob/main/packages/evmts/src/evmts.ts#L42)

___

### PutAccountAction

Ƭ **PutAccountAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `account` | `Address` |
| `balance?` | `bigint` |

#### Defined in

[actions/putAccount.ts:9](https://github.com/evmts/evmts-monorepo/blob/main/packages/evmts/src/actions/putAccount.ts#L9)

___

### PutContractCodeAction

Ƭ **PutContractCodeAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bytecode` | `Hex` |
| `contractAddress` | `Address` |

#### Defined in

[actions/putContractCode.ts:5](https://github.com/evmts/evmts-monorepo/blob/main/packages/evmts/src/actions/putContractCode.ts#L5)

___

### RunCallAction

Ƭ **RunCallAction**: `Object`

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

[actions/runCall.ts:5](https://github.com/evmts/evmts-monorepo/blob/main/packages/evmts/src/actions/runCall.ts#L5)

___

### RunContractCallAction

Ƭ **RunContractCallAction**\<`TAbi`, `TFunctionName`\>: `EncodeFunctionDataParameters`\<`TAbi`, `TFunctionName`\> & \{ `caller?`: `Address` ; `contractAddress`: `Address` ; `gasLimit?`: `bigint`  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `string` = `string` |

#### Defined in

[actions/runContractCall.ts:18](https://github.com/evmts/evmts-monorepo/blob/main/packages/evmts/src/actions/runContractCall.ts#L18)

___

### RunContractCallError

Ƭ **RunContractCallError**: `Error`

#### Defined in

[actions/runContractCall.ts:28](https://github.com/evmts/evmts-monorepo/blob/main/packages/evmts/src/actions/runContractCall.ts#L28)

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

[actions/runContractCall.ts:30](https://github.com/evmts/evmts-monorepo/blob/main/packages/evmts/src/actions/runContractCall.ts#L30)

___

### RunScriptAction

Ƭ **RunScriptAction**\<`TAbi`, `TFunctionName`\>: `EncodeFunctionDataParameters`\<`TAbi`, `TFunctionName`\> & \{ `bytecode`: `Hex` ; `caller?`: `Address`  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `string` = `string` |

#### Defined in

[actions/runScript.ts:11](https://github.com/evmts/evmts-monorepo/blob/main/packages/evmts/src/actions/runScript.ts#L11)

___

### RunScriptError

Ƭ **RunScriptError**: `Error`

#### Defined in

[actions/runScript.ts:20](https://github.com/evmts/evmts-monorepo/blob/main/packages/evmts/src/actions/runScript.ts#L20)

___

### RunScriptResult

Ƭ **RunScriptResult**\<`TAbi`, `TFunctionName`\>: [`RunContractCallResult`](modules.md#runcontractcallresult)\<`TAbi`, `TFunctionName`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `string` = `string` |

#### Defined in

[actions/runScript.ts:22](https://github.com/evmts/evmts-monorepo/blob/main/packages/evmts/src/actions/runScript.ts#L22)
