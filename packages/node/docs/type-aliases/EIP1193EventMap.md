[**@tevm/node**](../README.md)

***

[@tevm/node](../globals.md) / EIP1193EventMap

# Type Alias: EIP1193EventMap

> **EIP1193EventMap**: `object`

Defined in: [packages/node/src/EIP1193EventEmitterTypes.ts:32](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/EIP1193EventEmitterTypes.ts#L32)

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

`Block`

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

`TypedTransaction` | `ImpersonatedTx`

#### Returns

`void`

### newReceipt()

#### Parameters

##### receipt

`TxReceipt`

#### Returns

`void`
