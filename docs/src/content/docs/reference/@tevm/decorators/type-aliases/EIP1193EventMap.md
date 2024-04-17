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

• **accounts**: ```0x${string}```[]

#### Returns

`void`

### chainChanged()

#### Parameters

• **chainId**: `string`

#### Returns

`void`

### connect()

#### Parameters

• **connectInfo**: [`ProviderConnectInfo`](/reference/tevm/decorators/type-aliases/providerconnectinfo/)

#### Returns

`void`

### disconnect()

#### Parameters

• **error**: [`ProviderRpcError`](/reference/classes/providerrpcerror/)

#### Returns

`void`

### message()

#### Parameters

• **message**: [`ProviderMessage`](/reference/tevm/decorators/type-aliases/providermessage/)

#### Returns

`void`

## Source

[packages/decorators/src/eip1193/EIP1193Events.ts:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/EIP1193Events.ts#L28)
