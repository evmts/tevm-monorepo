[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [txpool](../README.md) / TxPool

# Class: TxPool

Defined in: packages/txpool/types/TxPool.d.ts:26

**`Experimental`**

Tx pool (mempool)

## Memberof

module:service

## Constructors

### new TxPool()

> **new TxPool**(`options`): [`TxPool`](TxPool.md)

Defined in: packages/txpool/types/TxPool.d.ts:83

**`Experimental`**

#### Parameters

##### options

`TxPoolOptions`

constructor parameters

#### Returns

[`TxPool`](TxPool.md)

## Properties

### BLOCKS\_BEFORE\_TARGET\_HEIGHT\_ACTIVATION

> **BLOCKS\_BEFORE\_TARGET\_HEIGHT\_ACTIVATION**: `number`

Defined in: packages/txpool/types/TxPool.d.ts:69

**`Experimental`**

Activate before chain head is reached to start
tx pool preparation (sorting out included txs)

***

### HANDLED\_CLEANUP\_TIME\_LIMIT

> **HANDLED\_CLEANUP\_TIME\_LIMIT**: `number`

Defined in: packages/txpool/types/TxPool.d.ts:78

**`Experimental`**

Number of minutes to forget about handled
txs (for cleanup/memory reasons)

***

### pool

> **pool**: `Map`\<`string`, `TxPoolObject`[]\>

Defined in: packages/txpool/types/TxPool.d.ts:39

**`Experimental`**

The central pool dataset.

Maps an address to a `TxPoolObject`

***

### POOLED\_STORAGE\_TIME\_LIMIT

> **POOLED\_STORAGE\_TIME\_LIMIT**: `number`

Defined in: packages/txpool/types/TxPool.d.ts:73

**`Experimental`**

Number of minutes to keep txs in the pool

***

### running

> **running**: `boolean`

Defined in: packages/txpool/types/TxPool.d.ts:31

**`Experimental`**

***

### txsByHash

> **txsByHash**: `Map`\<`string`, [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md)\>

Defined in: packages/txpool/types/TxPool.d.ts:47

**`Experimental`**

Transactions by hash

***

### txsByNonce

> **txsByNonce**: `Map`\<`string`, `Map`\<`bigint`, [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md)\>\>

Defined in: packages/txpool/types/TxPool.d.ts:51

**`Experimental`**

Transactions by account and nonce

***

### txsInNonceOrder

> **txsInNonceOrder**: `Map`\<`string`, [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md)[]\>

Defined in: packages/txpool/types/TxPool.d.ts:43

**`Experimental`**

Transactions in nonce order for all senders

***

### txsInPool

> **txsInPool**: `number`

Defined in: packages/txpool/types/TxPool.d.ts:55

**`Experimental`**

The number of txs currently in the pool

## Methods

### \_logPoolStats()

> **\_logPoolStats**(): `void`

Defined in: packages/txpool/types/TxPool.d.ts:237

**`Experimental`**

#### Returns

`void`

***

### add()

> **add**(`tx`, `requireSignature`?, `skipBalance`?): `Promise`\<\{ `error`: `null`; `hash`: `` `0x${string}` ``; \} \| \{ `error`: `string`; `hash`: `` `0x${string}` ``; \}\>

Defined in: packages/txpool/types/TxPool.d.ts:124

**`Experimental`**

#### Parameters

##### tx

Transaction

[`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) | [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md)

##### requireSignature?

`boolean`

##### skipBalance?

`boolean`

#### Returns

`Promise`\<\{ `error`: `null`; `hash`: `` `0x${string}` ``; \} \| \{ `error`: `string`; `hash`: `` `0x${string}` ``; \}\>

***

### addUnverified()

> **addUnverified**(`tx`): `Promise`\<\{ `error`: `null`; `hash`: `` `0x${string}` ``; \} \| \{ `error`: `string`; `hash`: `` `0x${string}` ``; \}\>

Defined in: packages/txpool/types/TxPool.d.ts:108

**`Experimental`**

#### Parameters

##### tx

Transaction

[`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) | [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md)

#### Returns

`Promise`\<\{ `error`: `null`; `hash`: `` `0x${string}` ``; \} \| \{ `error`: `string`; `hash`: `` `0x${string}` ``; \}\>

***

### cleanup()

> **cleanup**(): `void`

Defined in: packages/txpool/types/TxPool.d.ts:149

**`Experimental`**

#### Returns

`void`

***

### clear()

> **clear**(): `Promise`\<`void`\>

Defined in: packages/txpool/types/TxPool.d.ts:235

**`Experimental`**

#### Returns

`Promise`\<`void`\>

***

### close()

> **close**(): `void`

Defined in: packages/txpool/types/TxPool.d.ts:231

**`Experimental`**

#### Returns

`void`

***

### deepCopy()

> **deepCopy**(`opt`): [`TxPool`](TxPool.md)

Defined in: packages/txpool/types/TxPool.d.ts:84

**`Experimental`**

#### Parameters

##### opt

`TxPoolOptions`

#### Returns

[`TxPool`](TxPool.md)

***

### getByHash()

> **getByHash**(`txHashes`): `null` \| [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md) \| TypedTransaction \| ImpersonatedTx[]

Defined in: packages/txpool/types/TxPool.d.ts:136

**`Experimental`**

#### Parameters

##### txHashes

`string` | readonly `Uint8Array`\<`ArrayBufferLike`\>[]

#### Returns

`null` \| [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md) \| TypedTransaction \| ImpersonatedTx[]

Array with tx objects

***

### getBySenderAddress()

> **getBySenderAddress**(`address`): `Promise`\<`TxPoolObject`[]\>

Defined in: packages/txpool/types/TxPool.d.ts:165

**`Experimental`**

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<`TxPoolObject`[]\>

***

### getPendingTransactions()

> **getPendingTransactions**(): `Promise`\<([`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md))[]\>

Defined in: packages/txpool/types/TxPool.d.ts:170

**`Experimental`**

#### Returns

`Promise`\<([`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md))[]\>

Array of transactions

***

### getTransactionStatus()

> **getTransactionStatus**(`txHash`): `Promise`\<`"pending"` \| `"mined"` \| `"unknown"`\>

Defined in: packages/txpool/types/TxPool.d.ts:176

**`Experimental`**

#### Parameters

##### txHash

`string`

Transaction hash

#### Returns

`Promise`\<`"pending"` \| `"mined"` \| `"unknown"`\>

Transaction status: 'pending', 'mined', or 'unknown'

***

### logStats()

> **logStats**(): `void`

Defined in: packages/txpool/types/TxPool.d.ts:236

**`Experimental`**

#### Returns

`void`

***

### on()

> **on**(`event`, `callback`): `void`

Defined in: packages/txpool/types/TxPool.d.ts:186

**`Experimental`**

#### Parameters

##### event

Event name ('txadded' or 'txremoved')

`"txadded"` | `"txremoved"`

##### callback

(`hash`) => `void`

Handler function

#### Returns

`void`

***

### onBlockAdded()

> **onBlockAdded**(`block`): `Promise`\<`void`\>

Defined in: packages/txpool/types/TxPool.d.ts:197

**`Experimental`**

#### Parameters

##### block

[`Block`](../../block/classes/Block.md)

The block that was added

#### Returns

`Promise`\<`void`\>

***

### onChainReorganization()

> **onChainReorganization**(`removedBlocks`, `addedBlocks`): `Promise`\<`void`\>

Defined in: packages/txpool/types/TxPool.d.ts:203

**`Experimental`**

#### Parameters

##### removedBlocks

[`Block`](../../block/classes/Block.md)[]

Blocks that were removed from the canonical chain

##### addedBlocks

[`Block`](../../block/classes/Block.md)[]

Blocks that were added to the canonical chain

#### Returns

`Promise`\<`void`\>

***

### open()

> **open**(): `boolean`

Defined in: packages/txpool/types/TxPool.d.ts:88

**`Experimental`**

#### Returns

`boolean`

***

### removeByHash()

> **removeByHash**(`txHash`): `void`

Defined in: packages/txpool/types/TxPool.d.ts:141

**`Experimental`**

#### Parameters

##### txHash

`string`

Hash of the transaction

#### Returns

`void`

***

### removeNewBlockTxs()

> **removeNewBlockTxs**(`newBlocks`): `void`

Defined in: packages/txpool/types/TxPool.d.ts:145

**`Experimental`**

#### Parameters

##### newBlocks

[`Block`](../../block/classes/Block.md)[]

#### Returns

`void`

***

### start()

> **start**(): `boolean`

Defined in: packages/txpool/types/TxPool.d.ts:92

**`Experimental`**

#### Returns

`boolean`

***

### stop()

> **stop**(): `boolean`

Defined in: packages/txpool/types/TxPool.d.ts:227

**`Experimental`**

#### Returns

`boolean`

***

### txsByPriceAndNonce()

> **txsByPriceAndNonce**(`baseFee`?): `Promise`\<([`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md))[]\>

Defined in: packages/txpool/types/TxPool.d.ts:220

**`Experimental`**

#### Parameters

##### baseFee?

Provide a baseFee to exclude txs with a lower gasPrice

###### allowedBlobs?

`number`

###### baseFee?

`bigint`

#### Returns

`Promise`\<([`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md))[]\>
