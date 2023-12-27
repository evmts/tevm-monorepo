[@tevm/vm](../README.md) / [Modules](../modules.md) / viem

# Module: viem

## Table of contents

### Functions

- [tevmViemExtension](viem.md#tevmviemextension)
- [tevmViemExtensionOptimistic](viem.md#tevmviemextensionoptimistic)

## Functions

### tevmViemExtension

▸ **tevmViemExtension**(): `ViemTevmClientDecorator`

#### Returns

`ViemTevmClientDecorator`

#### Defined in

[vm/vm/src/viem/types.ts:117](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/viem/types.ts#L117)

___

### tevmViemExtensionOptimistic

▸ **tevmViemExtensionOptimistic**(): \<TTransport, TChain, TAccount\>(`client`: `Pick`\<\{ `account`: `TAccount` ; `addChain`: (`args`: `AddChainParameters`) => `Promise`\<`void`\> ; `batch?`: \{ `multicall?`: `boolean` \| \{ batchSize?: number \| undefined; wait?: number \| undefined; }  } ; `cacheTime`: `number` ; `chain`: `TChain` ; `deployContract`: \<TAbi, TChainOverride\>(`args`: `DeployContractParameters`\<`TAbi`, `TChain`, `TAccount`, `TChainOverride`\>) => `Promise`\<\`0x$\{string}\`\> ; `extend`: \<client\>(`fn`: (`client`: `Client`\<`TTransport`, `TChain`, `TAccount`, `WalletRpcSchema`, `WalletActions`\<`TChain`, `TAccount`\>\>) => `client`) => `Client`\<`TTransport`, `TChain`, `TAccount`, `WalletRpcSchema`, \{ [K in keyof client]: client[K]; } & `WalletActions`\<`TChain`, `TAccount`\>\> ; `getAddresses`: () => `Promise`\<`GetAddressesReturnType`\> ; `getChainId`: () => `Promise`\<`number`\> ; `getPermissions`: () => `Promise`\<`GetPermissionsReturnType`\> ; `key`: `string` ; `name`: `string` ; `pollingInterval`: `number` ; `prepareTransactionRequest`: \<TChainOverride\>(`args`: `PrepareTransactionRequestParameters`\<`TChain`, `TAccount`, `TChainOverride`\>) => `Promise`\<`PrepareTransactionRequestReturnType`\> ; `request`: `EIP1193RequestFn`\<`WalletRpcSchema`\> ; `requestAddresses`: () => `Promise`\<`RequestAddressesReturnType`\> ; `requestPermissions`: (`args`: \{ [x: string]: Record\<string, any\>; eth\_accounts: Record\<string, any\>; }) => `Promise`\<`RequestPermissionsReturnType`\> ; `sendRawTransaction`: (`args`: `SendRawTransactionParameters`) => `Promise`\<\`0x$\{string}\`\> ; `sendTransaction`: \<TChainOverride\>(`args`: `SendTransactionParameters`\<`TChain`, `TAccount`, `TChainOverride`\>) => `Promise`\<\`0x$\{string}\`\> ; `signMessage`: (`args`: `SignMessageParameters`\<`TAccount`\>) => `Promise`\<\`0x$\{string}\`\> ; `signTransaction`: \<TChainOverride\>(`args`: `SignTransactionParameters`\<`TChain`, `TAccount`, `TChainOverride`\>) => `Promise`\<\`0x$\{string}\`\> ; `signTypedData`: \<TTypedData, TPrimaryType\>(`args`: `SignTypedDataParameters`\<`TTypedData`, `TPrimaryType`, `TAccount`\>) => `Promise`\<\`0x$\{string}\`\> ; `switchChain`: (`args`: `SwitchChainParameters`) => `Promise`\<`void`\> ; `transport`: `ReturnType`\<`TTransport`\>[``"config"``] & `ReturnType`\<`TTransport`\>[``"value"``] ; `type`: `string` ; `uid`: `string` ; `watchAsset`: (`args`: `WatchAssetParams`) => `Promise`\<`boolean`\> ; `writeContract`: \<TAbi, TFunctionName, TChainOverride\>(`args`: `WriteContractParameters`\<`TAbi`, `TFunctionName`, `TChain`, `TAccount`, `TChainOverride`\>) => `Promise`\<\`0x$\{string}\`\>  }, ``"request"`` \| ``"writeContract"``\>) => \{ `writeContractOptimistic`: \<TAbi, TFunctionName, TChainOverride\>(`action`: `WriteContractParameters`\<`TAbi`, `TFunctionName`, `TChain`, `TAccount`, `TChainOverride`\>) => `AsyncGenerator`\<`OptimisticResult`\<`TAbi`, `TFunctionName`, `TChain`\>, `any`, `unknown`\>  }

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
| `writeContractOptimistic` | \<TAbi, TFunctionName, TChainOverride\>(`action`: `WriteContractParameters`\<`TAbi`, `TFunctionName`, `TChain`, `TAccount`, `TChainOverride`\>) => `AsyncGenerator`\<`OptimisticResult`\<`TAbi`, `TFunctionName`, `TChain`\>, `any`, `unknown`\> |

#### Defined in

[vm/vm/src/viem/tevmViemExtensionOptimistic.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/viem/tevmViemExtensionOptimistic.ts#L13)
