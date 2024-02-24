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

▪ **accounts**: \`0x${string}\`[]

### chainChanged()

#### Parameters

▪ **chainId**: `string`

### connect()

#### Parameters

▪ **connectInfo**: [`ProviderConnectInfo`](/reference/tevm/decorators/type-aliases/providerconnectinfo/)

### disconnect()

#### Parameters

▪ **error**: [`ProviderRpcError`](/reference/tevm/decorators/classes/providerrpcerror/)

### message()

#### Parameters

▪ **message**: [`ProviderMessage`](/reference/tevm/decorators/type-aliases/providermessage/)

## Source

[packages/decorators/src/eip1193/EIP1193Events.ts:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/EIP1193Events.ts#L28)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
