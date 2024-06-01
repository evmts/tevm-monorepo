---
editUrl: false
next: false
prev: false
title: "EIP1193EventMap"
---

> **EIP1193EventMap**: `object`

## Type declaration

### accountsChanged()

#### Parameters

• **accounts**: \`0x$\{string\}\`[]

#### Returns

`void`

### chainChanged()

#### Parameters

• **chainId**: `string`

#### Returns

`void`

### connect()

#### Parameters

• **connectInfo**: [`ProviderConnectInfo`](/reference/tevm/base-client/type-aliases/providerconnectinfo/)

#### Returns

`void`

### disconnect()

#### Parameters

• **error**: [`ProviderRpcError`](/reference/tevm/base-client/classes/providerrpcerror/)

#### Returns

`void`

### message()

#### Parameters

• **message**: [`ProviderMessage`](/reference/tevm/base-client/type-aliases/providermessage/)

#### Returns

`void`

### newBlock()

#### Parameters

• **block**: `Block`

#### Returns

`void`

### newLog()

#### Parameters

• **log**: [`EthjsLog`](/reference/tevm/utils/type-aliases/ethjslog/)

#### Returns

`void`

### newPendingTransaction()

#### Parameters

• **tx**: `TypedTransaction` \| `ImpersonatedTx`

#### Returns

`void`

## Source

[packages/base-client/src/EIP1193EventEmitterTypes.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/base-client/src/EIP1193EventEmitterTypes.ts#L30)
