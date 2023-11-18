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
| `customPrecompiles?` | `CustomPrecompile`[] |
| `fork?` | `ForkOptions` |

#### Defined in

[evmts.ts:42](https://github.com/evmts/evmts-monorepo/blob/main/vm/src/evmts.ts#L42)

___

### PutAccountAction

Ƭ **PutAccountAction**: `Object`

EVMts action to put an account into the vm state

#### Type declaration

| Name | Type |
| :------ | :------ |
| `account` | `Address` |
| `balance?` | `bigint` |

#### Defined in

[actions/putAccount.ts:12](https://github.com/evmts/evmts-monorepo/blob/main/vm/src/actions/putAccount.ts#L12)

___

### PutContractCodeAction

Ƭ **PutContractCodeAction**: `Object`

EVMts action to put contract code into the vm state

#### Type declaration

| Name | Type |
| :------ | :------ |
| `contractAddress` | `Address` |
| `deployedBytecode` | `Hex` |

#### Defined in

[actions/putContractCode.ts:8](https://github.com/evmts/evmts-monorepo/blob/main/vm/src/actions/putContractCode.ts#L8)

___

### RunCallAction

Ƭ **RunCallAction**: `Object`

EVMts action to execute a call on the vm

#### Type declaration

| Name | Type |
| :------ | :------ |
| `caller` | `Address` |
| `data` | `Hex` |
| `gasLimit?` | `bigint` |
| `origin?` | `Address` |
| `to` | `Address` |
| `value?` | `bigint` |

#### Defined in

[actions/runCall.ts:8](https://github.com/evmts/evmts-monorepo/blob/main/vm/src/actions/runCall.ts#L8)

___

### RunContractCallAction

Ƭ **RunContractCallAction**\<`TAbi`, `TFunctionName`\>: `EncodeFunctionDataParameters`\<`TAbi`, `TFunctionName`\> & \{ `caller?`: `Address` ; `contractAddress`: `Address` ; `gasLimit?`: `bigint`  }

EVMts action to execute a call on a contract

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `string` = `string` |

#### Defined in

[actions/runContractCall.ts:21](https://github.com/evmts/evmts-monorepo/blob/main/vm/src/actions/runContractCall.ts#L21)

___

### RunContractCallError

Ƭ **RunContractCallError**: `Error`

#### Defined in

[actions/runContractCall.ts:31](https://github.com/evmts/evmts-monorepo/blob/main/vm/src/actions/runContractCall.ts#L31)

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

[actions/runContractCall.ts:33](https://github.com/evmts/evmts-monorepo/blob/main/vm/src/actions/runContractCall.ts#L33)

___

### RunScriptAction

Ƭ **RunScriptAction**\<`TAbi`, `TFunctionName`\>: `EncodeFunctionDataParameters`\<`TAbi`, `TFunctionName`\> & \{ `caller?`: `Address` ; `deployedBytecode`: `Hex`  }

EVMts action to deploy and execute a script or contract

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `string` = `string` |

#### Defined in

[actions/runScript.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/vm/src/actions/runScript.ts#L14)

___

### RunScriptError

Ƭ **RunScriptError**: `Error`

#### Defined in

[actions/runScript.ts:23](https://github.com/evmts/evmts-monorepo/blob/main/vm/src/actions/runScript.ts#L23)

___

### RunScriptResult

Ƭ **RunScriptResult**\<`TAbi`, `TFunctionName`\>: [`RunContractCallResult`](modules.md#runcontractcallresult)\<`TAbi`, `TFunctionName`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] = `Abi` |
| `TFunctionName` | extends `string` = `string` |

#### Defined in

[actions/runScript.ts:25](https://github.com/evmts/evmts-monorepo/blob/main/vm/src/actions/runScript.ts#L25)
