[**@tevm/base-client**](../README.md) • **Docs**

***

[@tevm/base-client](../globals.md) / EIP1193EventMap

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

• **log**: `Log`\<`bigint`, `number`, `false`, `undefined`, `undefined`, `undefined`, `undefined`\>

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

[packages/base-client/src/EIP1193EventEmitterTypes.ts:32](https://github.com/evmts/tevm-monorepo/blob/main/packages/base-client/src/EIP1193EventEmitterTypes.ts#L32)
