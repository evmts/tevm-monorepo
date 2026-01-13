[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / EIP1193EventMap

# Type Alias: EIP1193EventMap

> **EIP1193EventMap** = `object`

Defined in: packages/node/dist/index.d.ts:242

## Methods

### accountsChanged()

> **accountsChanged**(`accounts`): `void`

Defined in: packages/node/dist/index.d.ts:243

#### Parameters

##### accounts

`` `0x${string}` ``[]

#### Returns

`void`

***

### chainChanged()

> **chainChanged**(`chainId`): `void`

Defined in: packages/node/dist/index.d.ts:244

#### Parameters

##### chainId

`string`

#### Returns

`void`

***

### connect()

> **connect**(`connectInfo`): `void`

Defined in: packages/node/dist/index.d.ts:245

#### Parameters

##### connectInfo

[`ProviderConnectInfo`](ProviderConnectInfo.md)

#### Returns

`void`

***

### disconnect()

> **disconnect**(`error`): `void`

Defined in: packages/node/dist/index.d.ts:246

#### Parameters

##### error

[`ProviderRpcError`](../classes/ProviderRpcError.md)

#### Returns

`void`

***

### message()

> **message**(`message`): `void`

Defined in: packages/node/dist/index.d.ts:247

#### Parameters

##### message

[`ProviderMessage`](ProviderMessage.md)

#### Returns

`void`

***

### newBlock()

> **newBlock**(`block`): `void`

Defined in: packages/node/dist/index.d.ts:250

#### Parameters

##### block

[`Block`](../../block/classes/Block.md)

#### Returns

`void`

***

### newLog()

> **newLog**(`log`): `void`

Defined in: packages/node/dist/index.d.ts:251

#### Parameters

##### log

[`Log`](../../evm/type-aliases/Log.md)

#### Returns

`void`

***

### newPendingTransaction()

> **newPendingTransaction**(`tx`): `void`

Defined in: packages/node/dist/index.d.ts:248

#### Parameters

##### tx

[`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) | [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md)

#### Returns

`void`

***

### newReceipt()

> **newReceipt**(`receipt`): `void`

Defined in: packages/node/dist/index.d.ts:249

#### Parameters

##### receipt

[`TxReceipt`](../../receipt-manager/type-aliases/TxReceipt.md)

#### Returns

`void`
