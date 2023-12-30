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

[extensions/viem/src/GenError.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/GenError.ts#L3)

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

[extensions/viem/src/GenResult.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/GenResult.ts#L3)

___

### OptimisticResult

Ƭ **OptimisticResult**\<`TAbi`, `TFunctionName`, `TChain`\>: [`GenResult`](modules.md#genresult)\<`RunContractCallResponse`\<`TAbi`, `TFunctionName`\>, ``"OPTIMISTIC_RESULT"``\> \| [`GenError`](modules.md#generror)\<`Error`, ``"OPTIMISTIC_RESULT"``\> \| [`GenResult`](modules.md#genresult)\<`WriteContractReturnType`, ``"HASH"``\> \| [`GenError`](modules.md#generror)\<`WriteContractErrorType`, ``"HASH"``\> \| [`GenResult`](modules.md#genresult)\<`WaitForTransactionReceiptReturnType`\<`TChain`\>, ``"RECEIPT"``\> \| [`GenError`](modules.md#generror)\<`WriteContractErrorType`, ``"RECEIPT"``\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] |
| `TFunctionName` | extends `string` |
| `TChain` | extends `Chain` \| `undefined` |

#### Defined in

[extensions/viem/src/OptimisticResult.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/OptimisticResult.ts#L12)

___

### TypedError

Ƭ **TypedError**\<`T`\>: `Error` & \{ `tag`: `T`  }

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[extensions/viem/src/TypedError.ts:1](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/TypedError.ts#L1)

___

### ViemTevmClient

Ƭ **ViemTevmClient**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `putAccount` | (`action`: `PutAccountAction`) => `Promise`\<`Account`\> |
| `putContractCode` | (`action`: `PutContractCodeAction`) => `Promise`\<`Uint8Array`\> |
| `runCall` | (`action`: `RunCallAction`) => `Promise`\<`EVMResult`\> |
| `runContractCall` | \<TAbi, TFunctionName\>(`action`: `RunContractCallAction`\<`TAbi`, `TFunctionName`\>) => `Promise`\<`RunContractCallResponse`\<`TAbi`, `TFunctionName`\>\> |
| `runScript` | \<TAbi, TFunctionName\>(`action`: `RunScriptAction`\<`TAbi`, `TFunctionName`\>) => `Promise`\<`RunScriptResponse`\<`TAbi`, `TFunctionName`\>\> |
| `tevmRequest` | \<T\>(`r`: `T`) => `Promise`\<`BackendReturnType`\<`T`\>[``"result"``]\> |

#### Defined in

[extensions/viem/src/ViemTevmClient.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/ViemTevmClient.ts#L19)

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

[extensions/viem/src/ViemTevmClientDecorator.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/ViemTevmClientDecorator.ts#L3)

___

### ViemTevmExtension

Ƭ **ViemTevmExtension**: () => [`ViemTevmClientDecorator`](modules.md#viemtevmclientdecorator)

#### Type declaration

▸ (): [`ViemTevmClientDecorator`](modules.md#viemtevmclientdecorator)

##### Returns

[`ViemTevmClientDecorator`](modules.md#viemtevmclientdecorator)

#### Defined in

[extensions/viem/src/ViemTevmExtension.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/ViemTevmExtension.ts#L3)

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
| `writeContractOptimistic` | \<TAbi, TFunctionName, TChainOverride\>(`action`: `WriteContractParameters`\<`TAbi`, `TFunctionName`, `TChain`, `TAccount`, `TChainOverride`\>) => `AsyncGenerator`\<[`OptimisticResult`](modules.md#optimisticresult)\<`TAbi`, `TFunctionName`, `TChain`\>, `any`, `unknown`\> |

#### Defined in

[extensions/viem/src/ViemTevmOptimisticClient.ts:5](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/ViemTevmOptimisticClient.ts#L5)

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

[extensions/viem/src/ViemTevmOptimisticClientDecorator.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/ViemTevmOptimisticClientDecorator.ts#L4)

___

### ViemTevmOptimisticExtension

Ƭ **ViemTevmOptimisticExtension**: () => [`ViemTevmOptimisticClientDecorator`](modules.md#viemtevmoptimisticclientdecorator)

#### Type declaration

▸ (): [`ViemTevmOptimisticClientDecorator`](modules.md#viemtevmoptimisticclientdecorator)

##### Returns

[`ViemTevmOptimisticClientDecorator`](modules.md#viemtevmoptimisticclientdecorator)

#### Defined in

[extensions/viem/src/ViemTevmOptimisticExtension.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/ViemTevmOptimisticExtension.ts#L3)

## Functions

### tevmViemExtension

▸ **tevmViemExtension**(): [`ViemTevmClientDecorator`](modules.md#viemtevmclientdecorator)

#### Returns

[`ViemTevmClientDecorator`](modules.md#viemtevmclientdecorator)

#### Defined in

[extensions/viem/src/ViemTevmExtension.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/ViemTevmExtension.ts#L3)

___

### tevmViemExtensionOptimistic

▸ **tevmViemExtensionOptimistic**(): \<TTransport, TChain, TAccount\>(`client`: `Pick`\<\{ `account`: `TAccount` ; `addChain`: (`args`: `AddChainParameters`) => `Promise`\<`void`\> ; `batch?`: \{ `multicall?`: `boolean` \| \{ batchSize?: number \| undefined; wait?: number \| undefined; }  } ; `cacheTime`: `number` ; `chain`: `TChain` ; `deployContract`: \<TAbi, TChainOverride\>(`args`: `DeployContractParameters`\<`TAbi`, `TChain`, `TAccount`, `TChainOverride`\>) => `Promise`\<\`0x$\{string}\`\> ; `extend`: \<client\>(`fn`: (`client`: `Client`\<`TTransport`, `TChain`, `TAccount`, `WalletRpcSchema`, `WalletActions`\<`TChain`, `TAccount`\>\>) => `client`) => `Client`\<`TTransport`, `TChain`, `TAccount`, `WalletRpcSchema`, \{ [K in keyof client]: client[K]; } & `WalletActions`\<`TChain`, `TAccount`\>\> ; `getAddresses`: () => `Promise`\<`GetAddressesReturnType`\> ; `getChainId`: () => `Promise`\<`number`\> ; `getPermissions`: () => `Promise`\<`GetPermissionsReturnType`\> ; `key`: `string` ; `name`: `string` ; `pollingInterval`: `number` ; `prepareTransactionRequest`: \<TChainOverride\>(`args`: `PrepareTransactionRequestParameters`\<`TChain`, `TAccount`, `TChainOverride`\>) => `Promise`\<`PrepareTransactionRequestReturnType`\> ; `request`: `EIP1193RequestFn`\<`WalletRpcSchema`\> ; `requestAddresses`: () => `Promise`\<`RequestAddressesReturnType`\> ; `requestPermissions`: (`args`: \{ [x: string]: Record\<string, any\>; eth\_accounts: Record\<string, any\>; }) => `Promise`\<`RequestPermissionsReturnType`\> ; `sendRawTransaction`: (`args`: `SendRawTransactionParameters`) => `Promise`\<\`0x$\{string}\`\> ; `sendTransaction`: \<TChainOverride\>(`args`: `SendTransactionParameters`\<`TChain`, `TAccount`, `TChainOverride`\>) => `Promise`\<\`0x$\{string}\`\> ; `signMessage`: (`args`: `SignMessageParameters`\<`TAccount`\>) => `Promise`\<\`0x$\{string}\`\> ; `signTransaction`: \<TChainOverride\>(`args`: `SignTransactionParameters`\<`TChain`, `TAccount`, `TChainOverride`\>) => `Promise`\<\`0x$\{string}\`\> ; `signTypedData`: \<TTypedData, TPrimaryType\>(`args`: `SignTypedDataParameters`\<`TTypedData`, `TPrimaryType`, `TAccount`\>) => `Promise`\<\`0x$\{string}\`\> ; `switchChain`: (`args`: `SwitchChainParameters`) => `Promise`\<`void`\> ; `transport`: `ReturnType`\<`TTransport`\>[``"config"``] & `ReturnType`\<`TTransport`\>[``"value"``] ; `type`: `string` ; `uid`: `string` ; `watchAsset`: (`args`: `WatchAssetParams`) => `Promise`\<`boolean`\> ; `writeContract`: \<TAbi, TFunctionName, TChainOverride\>(`args`: `WriteContractParameters`\<`TAbi`, `TFunctionName`, `TChain`, `TAccount`, `TChainOverride`\>) => `Promise`\<\`0x$\{string}\`\>  }, ``"request"`` \| ``"writeContract"``\>) => \{ `writeContractOptimistic`: \<TAbi, TFunctionName, TChainOverride\>(`action`: `WriteContractParameters`\<`TAbi`, `TFunctionName`, `TChain`, `TAccount`, `TChainOverride`\>) => `AsyncGenerator`\<[`OptimisticResult`](modules.md#optimisticresult)\<`TAbi`, `TFunctionName`, `TChain`\>, `any`, `unknown`\>  }

#### Returns

`fn`

▸ \<`TTransport`, `TChain`, `TAccount`\>(`client`): `Object`

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TTransport` | extends `Transport` = `Transport` |
| `TChain` | extends `undefined` \| `Chain` = `undefined` \| `Chain` |
| `TAccount` | extends `undefined` \| `Account` = `undefined` \| `Account` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `client` | `Pick`\<\{ `account`: `TAccount` ; `addChain`: (`args`: `AddChainParameters`) => `Promise`\<`void`\> ; `batch?`: \{ `multicall?`: `boolean` \| \{ batchSize?: number \| undefined; wait?: number \| undefined; }  } ; `cacheTime`: `number` ; `chain`: `TChain` ; `deployContract`: \<TAbi, TChainOverride\>(`args`: `DeployContractParameters`\<`TAbi`, `TChain`, `TAccount`, `TChainOverride`\>) => `Promise`\<\`0x$\{string}\`\> ; `extend`: \<client\>(`fn`: (`client`: `Client`\<`TTransport`, `TChain`, `TAccount`, `WalletRpcSchema`, `WalletActions`\<`TChain`, `TAccount`\>\>) => `client`) => `Client`\<`TTransport`, `TChain`, `TAccount`, `WalletRpcSchema`, \{ [K in keyof client]: client[K]; } & `WalletActions`\<`TChain`, `TAccount`\>\> ; `getAddresses`: () => `Promise`\<`GetAddressesReturnType`\> ; `getChainId`: () => `Promise`\<`number`\> ; `getPermissions`: () => `Promise`\<`GetPermissionsReturnType`\> ; `key`: `string` ; `name`: `string` ; `pollingInterval`: `number` ; `prepareTransactionRequest`: \<TChainOverride\>(`args`: `PrepareTransactionRequestParameters`\<`TChain`, `TAccount`, `TChainOverride`\>) => `Promise`\<`PrepareTransactionRequestReturnType`\> ; `request`: `EIP1193RequestFn`\<`WalletRpcSchema`\> ; `requestAddresses`: () => `Promise`\<`RequestAddressesReturnType`\> ; `requestPermissions`: (`args`: \{ [x: string]: Record\<string, any\>; eth\_accounts: Record\<string, any\>; }) => `Promise`\<`RequestPermissionsReturnType`\> ; `sendRawTransaction`: (`args`: `SendRawTransactionParameters`) => `Promise`\<\`0x$\{string}\`\> ; `sendTransaction`: \<TChainOverride\>(`args`: `SendTransactionParameters`\<`TChain`, `TAccount`, `TChainOverride`\>) => `Promise`\<\`0x$\{string}\`\> ; `signMessage`: (`args`: `SignMessageParameters`\<`TAccount`\>) => `Promise`\<\`0x$\{string}\`\> ; `signTransaction`: \<TChainOverride\>(`args`: `SignTransactionParameters`\<`TChain`, `TAccount`, `TChainOverride`\>) => `Promise`\<\`0x$\{string}\`\> ; `signTypedData`: \<TTypedData, TPrimaryType\>(`args`: `SignTypedDataParameters`\<`TTypedData`, `TPrimaryType`, `TAccount`\>) => `Promise`\<\`0x$\{string}\`\> ; `switchChain`: (`args`: `SwitchChainParameters`) => `Promise`\<`void`\> ; `transport`: `ReturnType`\<`TTransport`\>[``"config"``] & `ReturnType`\<`TTransport`\>[``"value"``] ; `type`: `string` ; `uid`: `string` ; `watchAsset`: (`args`: `WatchAssetParams`) => `Promise`\<`boolean`\> ; `writeContract`: \<TAbi, TFunctionName, TChainOverride\>(`args`: `WriteContractParameters`\<`TAbi`, `TFunctionName`, `TChain`, `TAccount`, `TChainOverride`\>) => `Promise`\<\`0x$\{string}\`\>  }, ``"request"`` \| ``"writeContract"``\> |

##### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `writeContractOptimistic` | \<TAbi, TFunctionName, TChainOverride\>(`action`: `WriteContractParameters`\<`TAbi`, `TFunctionName`, `TChain`, `TAccount`, `TChainOverride`\>) => `AsyncGenerator`\<[`OptimisticResult`](modules.md#optimisticresult)\<`TAbi`, `TFunctionName`, `TChain`\>, `any`, `unknown`\> |

#### Defined in

[extensions/viem/src/tevmViemExtensionOptimistic.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/tevmViemExtensionOptimistic.ts#L15)
