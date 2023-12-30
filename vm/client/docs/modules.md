[@tevm/client](README.md) / Exports

# @tevm/client

## Table of contents

### Type Aliases

- [Client](modules.md#client)

### Functions

- [createClient](modules.md#createclient)

## Type Aliases

### Client

Ƭ **Client**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `putAccount` | (`action`: `PutAccountAction`) => `Promise`\<`TevmPutAccountResponse`\> |
| `putContractCode` | (`action`: `PutContractCodeAction`) => `Promise`\<`TevmPutContractCodeResponse`\> |
| `request` | \<T\>(`r`: `T`) => `Promise`\<`BackendReturnType`\<`T`\>\> |
| `runCall` | (`action`: `RunCallAction`) => `Promise`\<`TevmCallResponse`\> |
| `runContractCall` | \<TAbi, TFunctionName\>(`action`: `RunContractCallAction`\<`TAbi`, `TFunctionName`\>) => `Promise`\<`RunContractCallResponse`\<`TAbi`, `TFunctionName`\>\> |
| `runScript` | \<TAbi, TFunctionName\>(`action`: `RunScriptAction`\<`TAbi`, `TFunctionName`\>) => `Promise`\<`RunScriptResponse`\<`TAbi`, `TFunctionName`\>\> |

#### Defined in

[Client.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/vm/client/src/Client.ts#L19)

## Functions

### createClient

▸ **createClient**(`rpcUrl`): [`Client`](modules.md#client)

#### Parameters

| Name | Type |
| :------ | :------ |
| `rpcUrl` | `string` |

#### Returns

[`Client`](modules.md#client)

#### Defined in

[createClient.js:11](https://github.com/evmts/tevm-monorepo/blob/main/vm/client/src/createClient.js#L11)
