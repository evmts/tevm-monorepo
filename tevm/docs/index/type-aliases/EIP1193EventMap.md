[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / EIP1193EventMap

# Type Alias: EIP1193EventMap

> **EIP1193EventMap** = `object`

Defined in: packages/node/dist/index.d.ts:251

## Methods

### accountsChanged()

> **accountsChanged**(`accounts`): `void`

Defined in: packages/node/dist/index.d.ts:252

#### Parameters

##### accounts

`` `0x${string}` ``[]

#### Returns

`void`

***

### chainChanged()

> **chainChanged**(`chainId`): `void`

Defined in: packages/node/dist/index.d.ts:253

#### Parameters

##### chainId

`string`

#### Returns

`void`

***

### connect()

> **connect**(`connectInfo`): `void`

Defined in: packages/node/dist/index.d.ts:254

#### Parameters

##### connectInfo

[`ProviderConnectInfo`](ProviderConnectInfo.md)

#### Returns

`void`

***

### disconnect()

> **disconnect**(`error`): `void`

Defined in: packages/node/dist/index.d.ts:255

#### Parameters

##### error

[`ProviderRpcError`](../classes/ProviderRpcError.md)

#### Returns

`void`

***

### message()

> **message**(`message`): `void`

Defined in: packages/node/dist/index.d.ts:256

#### Parameters

##### message

[`ProviderMessage`](ProviderMessage.md)

#### Returns

`void`

***

### newBlock()

> **newBlock**(`block`): `void`

Defined in: packages/node/dist/index.d.ts:259

#### Parameters

##### block

[`Block`](../../block/classes/Block.md)

#### Returns

`void`

***

### newLog()

> **newLog**(`log`): `void`

Defined in: packages/node/dist/index.d.ts:260

#### Parameters

##### log

`Log`\<`bigint`, `number`, `false`, `undefined`, `undefined`, `undefined`, `undefined`\>

#### Returns

`void`

***

### newPendingTransaction()

> **newPendingTransaction**(`tx`): `void`

Defined in: packages/node/dist/index.d.ts:257

#### Parameters

##### tx

[`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) | [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md)

#### Returns

`void`

***

### newReceipt()

> **newReceipt**(`receipt`): `void`

Defined in: packages/node/dist/index.d.ts:258

#### Parameters

##### receipt

[`TxReceipt`](../../receipt-manager/type-aliases/TxReceipt.md)

#### Returns

`void`
