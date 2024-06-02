[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / EIP1193EventMap

# Type alias: EIP1193EventMap

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

• **connectInfo**: [`ProviderConnectInfo`](ProviderConnectInfo.md)

#### Returns

`void`

### disconnect()

#### Parameters

• **error**: [`ProviderRpcError`](../classes/ProviderRpcError.md)

#### Returns

`void`

### message()

#### Parameters

• **message**: [`ProviderMessage`](ProviderMessage.md)

#### Returns

`void`

### newBlock()

#### Parameters

• **block**: `Block`

#### Returns

`void`

### newLog()

#### Parameters

• **log**: [`EthjsLog`](../../utils/type-aliases/EthjsLog.md)

#### Returns

`void`

### newPendingTransaction()

#### Parameters

• **tx**: `TypedTransaction` \| `ImpersonatedTx`

#### Returns

`void`

### newReceipt()

#### Parameters

• **receipt**: `TxReceipt`

#### Returns

`void`

## Source

packages/base-client/dist/index.d.ts:29
