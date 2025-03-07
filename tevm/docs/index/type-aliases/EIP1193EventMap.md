[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / EIP1193EventMap

# Type Alias: EIP1193EventMap

> **EIP1193EventMap**: `object`

Defined in: packages/node/dist/index.d.ts:29

## Type declaration

### accountsChanged()

#### Parameters

##### accounts

`` `0x${string}` ``[]

#### Returns

`void`

### chainChanged()

#### Parameters

##### chainId

`string`

#### Returns

`void`

### connect()

#### Parameters

##### connectInfo

[`ProviderConnectInfo`](ProviderConnectInfo.md)

#### Returns

`void`

### disconnect()

#### Parameters

##### error

[`ProviderRpcError`](../classes/ProviderRpcError.md)

#### Returns

`void`

### message()

#### Parameters

##### message

[`ProviderMessage`](ProviderMessage.md)

#### Returns

`void`

### newBlock()

#### Parameters

##### block

[`Block`](../../block/classes/Block.md)

#### Returns

`void`

### newLog()

#### Parameters

##### log

`Log`\<`bigint`, `number`, `false`, `undefined`, `undefined`, `undefined`, `undefined`\>

#### Returns

`void`

### newPendingTransaction()

#### Parameters

##### tx

[`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) | [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md)

#### Returns

`void`

### newReceipt()

#### Parameters

##### receipt

[`TxReceipt`](../../receipt-manager/type-aliases/TxReceipt.md)

#### Returns

`void`
