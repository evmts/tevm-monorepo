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

- [tevmTransport](modules.md#tevmtransport)
- [tevmViemExtension](modules.md#tevmviemextension)
- [tevmViemExtensionOptimistic](modules.md#tevmviemextensionoptimistic)

## Type Aliases

### GenError

Ƭ **GenError**\<`TErrorType`, `TTag`\>: `Object`

An error yield of writeContractOptimistic
Errors are yielded rather than throwing

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

[GenError.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/GenError.ts#L7)

___

### GenResult

Ƭ **GenResult**\<`TDataType`, `TTag`\>: `Object`

A result type for a single yield of writeContractOptimistic

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

[GenResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/GenResult.ts#L7)

___

### OptimisticResult

Ƭ **OptimisticResult**\<`TAbi`, `TFunctionName`, `TChain`\>: [`GenResult`](modules.md#genresult)\<`ContractResult`\<`TAbi`, `TFunctionName`\>, ``"OPTIMISTIC_RESULT"``\> \| [`GenError`](modules.md#generror)\<`Error`, ``"OPTIMISTIC_RESULT"``\> \| [`GenResult`](modules.md#genresult)\<`WriteContractReturnType`, ``"HASH"``\> \| [`GenError`](modules.md#generror)\<`WriteContractErrorType`, ``"HASH"``\> \| [`GenResult`](modules.md#genresult)\<`WaitForTransactionReceiptReturnType`\<`TChain`\>, ``"RECEIPT"``\> \| [`GenError`](modules.md#generror)\<`WriteContractErrorType`, ``"RECEIPT"``\>

The result of an optimistic write

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] |
| `TFunctionName` | extends `ContractFunctionName`\<`TAbi`\> |
| `TChain` | extends `Chain` \| `undefined` |

#### Defined in

[OptimisticResult.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/OptimisticResult.ts#L18)

___

### TypedError

Ƭ **TypedError**\<`T`\>: `Error` & \{ `tag`: `T`  }

An error with a tag

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[TypedError.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/TypedError.ts#L4)

___

### ViemTevmClient

Ƭ **ViemTevmClient**: `Object`

**`Deprecated`**

in favor of the viem transport
The decorated properties added by the `tevmViemExtension`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `tevm` | `TevmClient` |

#### Defined in

[ViemTevmClient.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/ViemTevmClient.ts#L7)

___

### ViemTevmClientDecorator

Ƭ **ViemTevmClientDecorator**: (`client`: `Pick`\<`Client`, ``"request"``\>) => [`ViemTevmClient`](modules.md#viemtevmclient)

**`Deprecated`**

in favor of the viem transport
A viem decorator for `tevmViemExtension`

#### Type declaration

▸ (`client`): [`ViemTevmClient`](modules.md#viemtevmclient)

##### Parameters

| Name | Type |
| :------ | :------ |
| `client` | `Pick`\<`Client`, ``"request"``\> |

##### Returns

[`ViemTevmClient`](modules.md#viemtevmclient)

#### Defined in

[ViemTevmClientDecorator.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/ViemTevmClientDecorator.ts#L7)

___

### ViemTevmExtension

Ƭ **ViemTevmExtension**: () => [`ViemTevmClientDecorator`](modules.md#viemtevmclientdecorator)

**`Deprecated`**

in favor of the viem transport

This extension is highly experimental and should not be used in production.

Creates a decorator to a viem wallet client that adds the `writeContractOptimistic` method to the `tevm` property.
This enables viem to optimistically update the tevm state before the transaction is mined.

**`Example`**

```ts
import { tevmViemExtensionOptimistic } from 'tevmViemExtensionOptimistic'
import { walletClient } from './walletClient.js'

const client = walletClient.extend(tevmViemExtensionOptimistic())

for (const result of client.tevm.writeContractOptimistic({
  from: '0x...',
  to: '0x...',
  abi: [...],
  functionName: 'transferFrom',
  args: ['0x...', '0x...', '1000000000000000000'],
})) {
	if (result.tag === 'OPTIMISTIC_RESULT') {
		expect(result).toEqual({
			data: mockRequestResponse as any,
			success: true,
			tag: 'OPTIMISTIC_RESULT',
		})
		expect((client.request as jest.Mock).mock.lastCall[0]).toEqual({
			method: 'tevm_contract',
         params: params,
			jsonrpc: '2.0',
		})
		expect((client.writeContract as jest.Mock).mock.lastCall[0]).toEqual({
			abi: params.abi,
			functionName: params.functionName,
			args: params.args,
			caller: params.caller,
			address: params.address,
			account: params.account,
			chain: params.chain,
		})
	} else if (result.tag === 'HASH') {
		expect(result).toEqual({
			data: mockWriteContractResponse,
			success: true,
			tag: 'HASH',
		})
	} else if (result.tag === 'RECEIPT') {
		expect(result).toEqual({
			data: mockTxReciept,
			success: true,
			tag: 'RECEIPT',
		})
		expect(mockWaitForTransactionReceipt.mock.lastCall[0]).toEqual(client)
		expect(mockWaitForTransactionReceipt.mock.lastCall[1]).toEqual({
			hash: mockWriteContractResponse,
		})
	}
}

#### Type declaration

▸ (): [`ViemTevmClientDecorator`](modules.md#viemtevmclientdecorator)

##### Returns

[`ViemTevmClientDecorator`](modules.md#viemtevmclientdecorator)

#### Defined in

[ViemTevmExtension.ts:63](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/ViemTevmExtension.ts#L63)

___

### ViemTevmOptimisticClient

Ƭ **ViemTevmOptimisticClient**\<`TChain`, `TAccount`\>: `Object`

**`Deprecated`**

in favor of the viem transport

The decorated methods added to a viem wallet client by `tevmViemExtensionOptimistic`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TChain` | extends `Chain` \| `undefined` = `Chain` |
| `TAccount` | extends `Account` \| `undefined` = `Account` \| `undefined` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `tevm` | `Omit`\<`TevmClient`, ``"request"``\> & \{ `writeContractOptimistic`: \<TAbi, TFunctionName, TArgs, TChainOverride\>(`action`: `WriteContractParameters`\<`TAbi`, `TFunctionName`, `TArgs`, `TChain`, `TAccount`, `TChainOverride`\>) => `AsyncGenerator`\<[`OptimisticResult`](modules.md#optimisticresult)\<`TAbi`, `TFunctionName`, `TChain`\>, `any`, `unknown`\>  } |

#### Defined in

[ViemTevmOptimisticClient.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/ViemTevmOptimisticClient.ts#L17)

___

### ViemTevmOptimisticClientDecorator

Ƭ **ViemTevmOptimisticClientDecorator**: \<TTransport, TChain, TAccount\>(`client`: `Pick`\<`WalletClient`, ``"request"`` \| ``"writeContract"``\>) => [`ViemTevmOptimisticClient`](modules.md#viemtevmoptimisticclient)\<`TChain`, `TAccount`\>

**`Deprecated`**

in favor of the viem transport

A viem decorator for `tevmViemExtension`

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

[ViemTevmOptimisticClientDecorator.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/ViemTevmOptimisticClientDecorator.ts#L9)

___

### ViemTevmOptimisticExtension

Ƭ **ViemTevmOptimisticExtension**: () => [`ViemTevmOptimisticClientDecorator`](modules.md#viemtevmoptimisticclientdecorator)

**`Deprecated`**

in favor of the viem transport

Decorates a viem [public client](https://viem.sh/) with the [tevm api](https://tevm.sh/generated/tevm/api/type-aliases/tevm/)

**`Example`**

```js
import { createClient, parseEth } from 'viem'
import { tevmViemExtension } from '@tevm/viem-extension'

const client = createClient('https://mainnet.optimism.io')
  .extend(tevmViemExtension())

await client.tevm.account({
  address: `0x${'12'.repeat(20)}`,
  balance: parseEth('420'),
})
```

**`See`**

[@tevm/server](https://tevm.sh/generated/tevm/server/functions/createserver) for documentation on creating a tevm backend

#### Type declaration

▸ (): [`ViemTevmOptimisticClientDecorator`](modules.md#viemtevmoptimisticclientdecorator)

##### Returns

[`ViemTevmOptimisticClientDecorator`](modules.md#viemtevmoptimisticclientdecorator)

#### Defined in

[ViemTevmOptimisticExtension.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/ViemTevmOptimisticExtension.ts#L22)

## Functions

### tevmTransport

▸ **tevmTransport**(`tevm`, `options?`): `Transport`\<`string`, `Record`\<`string`, `any`\>, `EIP1193RequestFn`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tevm` | `Object` | The Tevm instance |
| `tevm.request` | `TevmJsonRpcRequestHandler` | - |
| `options?` | `Pick`\<`TransportConfig`\<`string`, `EIP1193RequestFn`\>, ``"name"`` \| ``"key"``\> |  |

#### Returns

`Transport`\<`string`, `Record`\<`string`, `any`\>, `EIP1193RequestFn`\>

The transport function

#### Defined in

[tevmTransport.js:8](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/tevmTransport.js#L8)

___

### tevmViemExtension

▸ **tevmViemExtension**(): [`ViemTevmClientDecorator`](modules.md#viemtevmclientdecorator)

#### Returns

[`ViemTevmClientDecorator`](modules.md#viemtevmclientdecorator)

**`Deprecated`**

in favor of the viem transport
Decorates a viem [public client](https://viem.sh/) with the [tevm api](https://tevm.sh/generated/tevm/api/type-aliases/tevm/)

**`Example`**

```js
import { createClient, parseEth } from 'viem'
import { tevmViemExtension } from '@tevm/viem-extension'

const client = createClient('https://mainnet.optimism.io')
  .extend(tevmViemExtension())

await client.tevm.account({
  address: `0x${'12'.repeat(20)}`,
  balance: parseEth('420'),
})
```

**`See`**

[@tevm/server](https://tevm.sh/generated/tevm/server/functions/createserver) for documentation on creating a tevm backend

#### Defined in

[tevmViemExtension.js:42](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/tevmViemExtension.js#L42)

___

### tevmViemExtensionOptimistic

▸ **tevmViemExtensionOptimistic**(): [`ViemTevmOptimisticClientDecorator`](modules.md#viemtevmoptimisticclientdecorator)

#### Returns

[`ViemTevmOptimisticClientDecorator`](modules.md#viemtevmoptimisticclientdecorator)

**`Deprecated`**

in favor of the viem transport

This extension is highly experimental and should not be used in production.

Creates a decorator to a viem wallet client that adds the `writeContractOptimistic` method to the `tevm` property.
It also decorates all the normal `tevm` methods from the [Tevm api](https://tevm.sh/generated/tevm/api/type-aliases/tevm/)
This enables viem to optimistically update the tevm state before the transaction is mined.

**`Example`**

```ts
import { tevmViemExtensionOptimistic } from 'tevmViemExtensionOptimistic'
import { walletClient } from './walletClient.js'

const client = walletClient.extend(tevmViemExtensionOptimistic())

for (const result of client.tevm.writeContractOptimistic({
  from: '0x...',
  to: '0x...',
  abi: [...],
  functionName: 'transferFrom',
  args: ['0x...', '0x...', '1000000000000000000'],
})) {
	if (result.tag === 'OPTIMISTIC_RESULT') {
		expect(result).toEqual({
			data: mockRequestResponse as any,
			success: true,
			tag: 'OPTIMISTIC_RESULT',
		})
		expect((client.request as jest.Mock).mock.lastCall[0]).toEqual({
			method: 'tevm_contract',
				params: params,
			jsonrpc: '2.0',
		})
		expect((client.writeContract as jest.Mock).mock.lastCall[0]).toEqual({
			abi: params.abi,
			functionName: params.functionName,
			args: params.args,
			caller: params.caller,
			address: params.address,
			account: params.account,
			chain: params.chain,
		})
	} else if (result.tag === 'HASH') {
		expect(result).toEqual({
			data: mockWriteContractResponse,
			success: true,
			tag: 'HASH',
		})
	} else if (result.tag === 'RECEIPT') {
		expect(result).toEqual({
			data: mockTxReciept,
			success: true,
			tag: 'RECEIPT',
		})
		expect(mockWaitForTransactionReceipt.mock.lastCall[0]).toEqual(client)
		expect(mockWaitForTransactionReceipt.mock.lastCall[1]).toEqual({
			hash: mockWriteContractResponse,
		})
	}
}

#### Defined in

[tevmViemExtensionOptimistic.js:66](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/tevmViemExtensionOptimistic.js#L66)
