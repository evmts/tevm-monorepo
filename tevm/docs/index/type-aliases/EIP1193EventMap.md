[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / EIP1193EventMap

# Type Alias: EIP1193EventMap

> **EIP1193EventMap** = `object`

Defined in: packages/node/dist/index.d.ts:29

## Methods

### accountsChanged()

> **accountsChanged**(`accounts`): `void`

Defined in: packages/node/dist/index.d.ts:30

#### Parameters

##### accounts

`` `0x${string}` ``[]

#### Returns

`void`

***

### chainChanged()

> **chainChanged**(`chainId`): `void`

Defined in: packages/node/dist/index.d.ts:31

#### Parameters

##### chainId

`string`

#### Returns

`void`

***

### connect()

> **connect**(`connectInfo`): `void`

Defined in: packages/node/dist/index.d.ts:32

#### Parameters

##### connectInfo

[`ProviderConnectInfo`](ProviderConnectInfo.md)

#### Returns

`void`

***

### disconnect()

> **disconnect**(`error`): `void`

Defined in: packages/node/dist/index.d.ts:33

#### Parameters

##### error

[`ProviderRpcError`](../classes/ProviderRpcError.md)

#### Returns

`void`

***

### message()

> **message**(`message`): `void`

Defined in: packages/node/dist/index.d.ts:34

#### Parameters

##### message

[`ProviderMessage`](ProviderMessage.md)

#### Returns

`void`

***

### newBlock()

> **newBlock**(`block`): `void`

Defined in: packages/node/dist/index.d.ts:37

#### Parameters

##### block

[`Block`](../../block/classes/Block.md)

#### Returns

`void`

***

### newLog()

> **newLog**(`log`): `void`

Defined in: packages/node/dist/index.d.ts:38

#### Parameters

##### log

`Log`\<`bigint`, `number`, `false`, `undefined`, `undefined`, `undefined`, `undefined`\>

#### Returns

`void`

***

### newPendingTransaction()

> **newPendingTransaction**(`tx`): `void`

Defined in: packages/node/dist/index.d.ts:35

#### Parameters

##### tx

[`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) | [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md)

#### Returns

`void`

***

### newReceipt()

> **newReceipt**(`receipt`): `void`

Defined in: packages/node/dist/index.d.ts:36

#### Parameters

##### receipt

[`TxReceipt`](../../receipt-manager/type-aliases/TxReceipt.md)

#### Returns

`void`
