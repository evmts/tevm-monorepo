[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / EIP1193EventMap

# Type Alias: EIP1193EventMap

> **EIP1193EventMap** = `object`

Defined in: tevm-monorepo/packages/node/dist/index.d.ts:236

## Methods

### accountsChanged()

> **accountsChanged**(`accounts`): `void`

Defined in: tevm-monorepo/packages/node/dist/index.d.ts:237

#### Parameters

##### accounts

`` `0x${string}` ``[]

#### Returns

`void`

***

### chainChanged()

> **chainChanged**(`chainId`): `void`

Defined in: tevm-monorepo/packages/node/dist/index.d.ts:238

#### Parameters

##### chainId

`string`

#### Returns

`void`

***

### connect()

> **connect**(`connectInfo`): `void`

Defined in: tevm-monorepo/packages/node/dist/index.d.ts:239

#### Parameters

##### connectInfo

[`ProviderConnectInfo`](ProviderConnectInfo.md)

#### Returns

`void`

***

### disconnect()

> **disconnect**(`error`): `void`

Defined in: tevm-monorepo/packages/node/dist/index.d.ts:240

#### Parameters

##### error

[`ProviderRpcError`](../classes/ProviderRpcError.md)

#### Returns

`void`

***

### message()

> **message**(`message`): `void`

Defined in: tevm-monorepo/packages/node/dist/index.d.ts:241

#### Parameters

##### message

[`ProviderMessage`](ProviderMessage.md)

#### Returns

`void`

***

### newBlock()

> **newBlock**(`block`): `void`

Defined in: tevm-monorepo/packages/node/dist/index.d.ts:244

#### Parameters

##### block

[`Block`](../../block/classes/Block.md)

#### Returns

`void`

***

### newLog()

> **newLog**(`log`): `void`

Defined in: tevm-monorepo/packages/node/dist/index.d.ts:245

#### Parameters

##### log

[`EthjsLog`](../../utils/type-aliases/EthjsLog.md)

#### Returns

`void`

***

### newPendingTransaction()

> **newPendingTransaction**(`tx`): `void`

Defined in: tevm-monorepo/packages/node/dist/index.d.ts:242

#### Parameters

##### tx

[`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| `ImpersonatedTx`

#### Returns

`void`

***

### newReceipt()

> **newReceipt**(`receipt`): `void`

Defined in: tevm-monorepo/packages/node/dist/index.d.ts:243

#### Parameters

##### receipt

[`TxReceipt`](../../receipt-manager/type-aliases/TxReceipt.md)

#### Returns

`void`
