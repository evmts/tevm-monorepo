[@tevm/viem](README.md) / Exports

# @tevm/viem

## Table of contents

### Type Aliases

- [GenError](modules.md#generror)
- [GenResult](modules.md#genresult)
- [OptimisticResult](modules.md#optimisticresult)
- [TypedError](modules.md#typederror)
- [ViemTevmClient](modules.md#viemtevmclient)
- [ViemTevmClientDecorator](modules.md#viemtevmclientdecorator)
- [ViemTevmExtension](modules.md#viemtevmextension)
- [ViemTevmOptimisticClient](modules.md#viemtevmoptimisticclient)
- [ViemTevmOptimisticClientDecorator](modules.md#viemtevmoptimisticclientdecorator)
- [ViemTevmOptimisticExtension](modules.md#viemtevmoptimisticextension)

### Functions

- [tevmViemExtension](modules.md#tevmviemextension)
- [tevmViemExtensionOptimistic](modules.md#tevmviemextensionoptimistic)

## Type Aliases

### GenError

Ƭ **GenError**\<`TErrorType`, `TTag`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TErrorType` | `TErrorType` |
| `TTag` | extends `string` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `error` | `TErrorType` |
| `errors?` | `ReadonlyArray`\<[`TypedError`](modules.md#typederror)\<`string`\>\> |
| `success` | ``false`` |
| `tag` | `TTag` |

#### Defined in

[GenError.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/GenError.ts#L3)

___

### GenResult

Ƭ **GenResult**\<`TDataType`, `TTag`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TDataType` | `TDataType` |
| `TTag` | extends `string` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data` | `TDataType` |
| `errors?` | `ReadonlyArray`\<[`TypedError`](modules.md#typederror)\<`string`\>\> |
| `success` | ``true`` |
| `tag` | `TTag` |

#### Defined in

[GenResult.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/GenResult.ts#L3)

___

### OptimisticResult

Ƭ **OptimisticResult**\<`TAbi`, `TFunctionName`, `TChain`\>: [`GenResult`](modules.md#genresult)\<`ContractResult`\<`TAbi`, `TFunctionName`\>, ``"OPTIMISTIC_RESULT"``\> \| [`GenError`](modules.md#generror)\<`Error`, ``"OPTIMISTIC_RESULT"``\> \| [`GenResult`](modules.md#genresult)\<`WriteContractReturnType`, ``"HASH"``\> \| [`GenError`](modules.md#generror)\<`WriteContractErrorType`, ``"HASH"``\> \| [`GenResult`](modules.md#genresult)\<`WaitForTransactionReceiptReturnType`\<`TChain`\>, ``"RECEIPT"``\> \| [`GenError`](modules.md#generror)\<`WriteContractErrorType`, ``"RECEIPT"``\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] |
| `TFunctionName` | extends `ContractFunctionName`\<`TAbi`\> |
| `TChain` | extends `Chain` \| `undefined` |

#### Defined in

[OptimisticResult.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/OptimisticResult.ts#L13)

___

### TypedError

Ƭ **TypedError**\<`T`\>: `Error` & \{ `tag`: `T`  }

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[TypedError.ts:1](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/TypedError.ts#L1)

___

### ViemTevmClient

Ƭ **ViemTevmClient**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `tevm` | `TevmClient` |

#### Defined in

[ViemTevmClient.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/ViemTevmClient.ts#L3)

___

### ViemTevmClientDecorator

Ƭ **ViemTevmClientDecorator**: (`client`: `Pick`\<`Client`, ``"request"``\>) => [`ViemTevmClient`](modules.md#viemtevmclient)

#### Type declaration

▸ (`client`): [`ViemTevmClient`](modules.md#viemtevmclient)

##### Parameters

| Name | Type |
| :------ | :------ |
| `client` | `Pick`\<`Client`, ``"request"``\> |

##### Returns

[`ViemTevmClient`](modules.md#viemtevmclient)

#### Defined in

[ViemTevmClientDecorator.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/ViemTevmClientDecorator.ts#L3)

___

### ViemTevmExtension

Ƭ **ViemTevmExtension**: () => [`ViemTevmClientDecorator`](modules.md#viemtevmclientdecorator)

#### Type declaration

▸ (): [`ViemTevmClientDecorator`](modules.md#viemtevmclientdecorator)

##### Returns

[`ViemTevmClientDecorator`](modules.md#viemtevmclientdecorator)

#### Defined in

[ViemTevmExtension.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/ViemTevmExtension.ts#L3)

___

### ViemTevmOptimisticClient

Ƭ **ViemTevmOptimisticClient**\<`TChain`, `TAccount`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TChain` | extends `Chain` \| `undefined` = `Chain` |
| `TAccount` | extends `Account` \| `undefined` = `Account` \| `undefined` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `tevm` | `TevmClient` & \{ `writeContractOptimistic`: \<TAbi, TFunctionName, TArgs, TChainOverride\>(`action`: `WriteContractParameters`\<`TAbi`, `TFunctionName`, `TArgs`, `TChain`, `TAccount`, `TChainOverride`\>) => `AsyncGenerator`\<[`OptimisticResult`](modules.md#optimisticresult)\<`TAbi`, `TFunctionName`, `TChain`\>, `any`, `unknown`\>  } |

#### Defined in

[ViemTevmOptimisticClient.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/ViemTevmOptimisticClient.ts#L12)

___

### ViemTevmOptimisticClientDecorator

Ƭ **ViemTevmOptimisticClientDecorator**: \<TTransport, TChain, TAccount\>(`client`: `Pick`\<`WalletClient`, ``"request"`` \| ``"writeContract"``\>) => [`ViemTevmOptimisticClient`](modules.md#viemtevmoptimisticclient)\<`TChain`, `TAccount`\>

#### Type declaration

▸ \<`TTransport`, `TChain`, `TAccount`\>(`client`): [`ViemTevmOptimisticClient`](modules.md#viemtevmoptimisticclient)\<`TChain`, `TAccount`\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TTransport` | extends `Transport` = `Transport` |
| `TChain` | extends `Chain` \| `undefined` = `Chain` \| `undefined` |
| `TAccount` | extends `Account` \| `undefined` = `Account` \| `undefined` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `client` | `Pick`\<`WalletClient`, ``"request"`` \| ``"writeContract"``\> |

##### Returns

[`ViemTevmOptimisticClient`](modules.md#viemtevmoptimisticclient)\<`TChain`, `TAccount`\>

#### Defined in

[ViemTevmOptimisticClientDecorator.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/ViemTevmOptimisticClientDecorator.ts#L4)

___

### ViemTevmOptimisticExtension

Ƭ **ViemTevmOptimisticExtension**: () => [`ViemTevmOptimisticClientDecorator`](modules.md#viemtevmoptimisticclientdecorator)

#### Type declaration

▸ (): [`ViemTevmOptimisticClientDecorator`](modules.md#viemtevmoptimisticclientdecorator)

##### Returns

[`ViemTevmOptimisticClientDecorator`](modules.md#viemtevmoptimisticclientdecorator)

#### Defined in

[ViemTevmOptimisticExtension.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/ViemTevmOptimisticExtension.ts#L3)

## Functions

### tevmViemExtension

▸ **tevmViemExtension**(): [`ViemTevmClientDecorator`](modules.md#viemtevmclientdecorator)

#### Returns

[`ViemTevmClientDecorator`](modules.md#viemtevmclientdecorator)

#### Defined in

[ViemTevmExtension.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/ViemTevmExtension.ts#L3)

___

### tevmViemExtensionOptimistic

▸ **tevmViemExtensionOptimistic**(): [`ViemTevmOptimisticClientDecorator`](modules.md#viemtevmoptimisticclientdecorator)

#### Returns

[`ViemTevmOptimisticClientDecorator`](modules.md#viemtevmoptimisticclientdecorator)

#### Defined in

[tevmViemExtensionOptimistic.js:4](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/tevmViemExtensionOptimistic.js#L4)
