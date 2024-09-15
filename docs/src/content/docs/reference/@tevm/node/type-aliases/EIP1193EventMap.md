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

• **connectInfo**: [`ProviderConnectInfo`](/reference/tevm/node/type-aliases/providerconnectinfo/)

#### Returns

`void`

### disconnect()

#### Parameters

• **error**: [`ProviderRpcError`](/reference/tevm/node/classes/providerrpcerror/)

#### Returns

`void`

### message()

#### Parameters

• **message**: [`ProviderMessage`](/reference/tevm/node/type-aliases/providermessage/)

#### Returns

`void`

### newBlock()

#### Parameters

• **block**: [`Block`](/reference/tevm/block/classes/block/)

#### Returns

`void`

### newLog()

#### Parameters

• **log**: `Log`\<`bigint`, `number`, `false`, `undefined`, `undefined`, `undefined`, `undefined`\>

#### Returns

`void`

### newPendingTransaction()

#### Parameters

• **tx**: [`TypedTransaction`](/reference/tevm/tx/type-aliases/typedtransaction/) \| [`ImpersonatedTx`](/reference/tevm/tx/interfaces/impersonatedtx/)

#### Returns

`void`

### newReceipt()

#### Parameters

• **receipt**: [`TxReceipt`](/reference/tevm/receipt-manager/type-aliases/txreceipt/)

#### Returns

`void`

## Defined in

[packages/node/src/EIP1193EventEmitterTypes.ts:32](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/node/src/EIP1193EventEmitterTypes.ts#L32)
