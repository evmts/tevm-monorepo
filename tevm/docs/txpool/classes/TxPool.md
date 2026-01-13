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

### Constructor

> **new TxPool**(`options`): `TxPool`

Defined in: packages/txpool/types/TxPool.d.ts:83

**`Experimental`**

Create new tx pool

#### Parameters

##### options

`TxPoolOptions`

constructor parameters

#### Returns

`TxPool`

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

Defined in: packages/txpool/types/TxPool.d.ts:241

**`Experimental`**

#### Returns

`void`

***

### add()

> **add**(`tx`, `requireSignature?`, `skipBalance?`): `Promise`\<\{ `error`: `null`; `hash`: `` `0x${string}` ``; \} \| \{ `error`: `string`; `hash`: `` `0x${string}` ``; \}\>

Defined in: packages/txpool/types/TxPool.d.ts:124

**`Experimental`**

Adds a tx to the pool.

If there is a tx in the pool with the same address and
nonce it will be replaced by the new tx, if it has a sufficient gas bump.
This also verifies certain constraints, if these are not met, tx will not be added to the pool.

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

Adds a tx to the pool without validating it.

If there is a tx in the pool with the same address and
nonce it will be replaced by the new tx, if it has a sufficient gas bump.
This also verifies certain constraints, if these are not met, tx will not be added to the pool.

#### Parameters

##### tx

Transaction

[`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) | [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md)

#### Returns

`Promise`\<\{ `error`: `null`; `hash`: `` `0x${string}` ``; \} \| \{ `error`: `string`; `hash`: `` `0x${string}` ``; \}\>

***

### cleanup()

> **cleanup**(): `void`

Defined in: packages/txpool/types/TxPool.d.ts:152

**`Experimental`**

Regular tx pool cleanup

#### Returns

`void`

***

### clear()

> **clear**(): `Promise`\<`void`\>

Defined in: packages/txpool/types/TxPool.d.ts:239

**`Experimental`**

Clears the pool of all transactions.

#### Returns

`Promise`\<`void`\>

***

### close()

> **close**(): `void`

Defined in: packages/txpool/types/TxPool.d.ts:235

**`Experimental`**

Close pool

#### Returns

`void`

***

### deepCopy()

> **deepCopy**(`opt`): `TxPool`

Defined in: packages/txpool/types/TxPool.d.ts:84

**`Experimental`**

#### Parameters

##### opt

`TxPoolOptions`

#### Returns

`TxPool`

***

### getByHash()

#### Call Signature

> **getByHash**(`txHashes`): `null` \| [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md)

Defined in: packages/txpool/types/TxPool.d.ts:136

**`Experimental`**

Returns the available txs from the pool

##### Parameters

###### txHashes

`string`

##### Returns

`null` \| [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md)

Array with tx objects

#### Call Signature

> **getByHash**(`txHashes`): ([`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md))[]

Defined in: packages/txpool/types/TxPool.d.ts:137

**`Experimental`**

Returns the available txs from the pool

##### Parameters

###### txHashes

readonly `Uint8Array`\<`ArrayBufferLike`\>[]

##### Returns

([`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md))[]

Array with tx objects

#### Call Signature

> **getByHash**(`txHashes`): `null` \| [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md)

Defined in: packages/txpool/types/TxPool.d.ts:138

**`Experimental`**

Returns the available txs from the pool

##### Parameters

###### txHashes

`string`

##### Returns

`null` \| [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md)

Array with tx objects

#### Call Signature

> **getByHash**(`txHashes`): ([`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md))[]

Defined in: packages/txpool/types/TxPool.d.ts:139

**`Experimental`**

Returns the available txs from the pool

##### Parameters

###### txHashes

readonly `Uint8Array`\<`ArrayBufferLike`\>[]

##### Returns

([`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md))[]

Array with tx objects

***

### getBySenderAddress()

> **getBySenderAddress**(`address`): `Promise`\<`TxPoolObject`[]\>

Defined in: packages/txpool/types/TxPool.d.ts:168

**`Experimental`**

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<`TxPoolObject`[]\>

***

### getPendingTransactions()

> **getPendingTransactions**(): `Promise`\<([`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md))[]\>

Defined in: packages/txpool/types/TxPool.d.ts:173

**`Experimental`**

Get all pending transactions in the pool

#### Returns

`Promise`\<([`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md))[]\>

Array of transactions

***

### getTransactionStatus()

> **getTransactionStatus**(`txHash`): `Promise`\<`"pending"` \| `"mined"` \| `"unknown"`\>

Defined in: packages/txpool/types/TxPool.d.ts:179

**`Experimental`**

Get transaction status

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

Defined in: packages/txpool/types/TxPool.d.ts:240

**`Experimental`**

#### Returns

`void`

***

### on()

> **on**(`event`, `callback`): () => `void`

Defined in: packages/txpool/types/TxPool.d.ts:190

**`Experimental`**

Register an event handler

#### Parameters

##### event

Event name ('txadded' or 'txremoved')

`"txadded"` | `"txremoved"`

##### callback

(`hash`) => `void`

Handler function

#### Returns

Unsubscribe function

> (): `void`

##### Returns

`void`

***

### onBlockAdded()

> **onBlockAdded**(`block`): `Promise`\<`void`\>

Defined in: packages/txpool/types/TxPool.d.ts:201

**`Experimental`**

Handle block being added to the chain

#### Parameters

##### block

[`Block`](../../block/classes/Block.md)

The block that was added

#### Returns

`Promise`\<`void`\>

***

### onChainReorganization()

> **onChainReorganization**(`removedBlocks`, `addedBlocks`): `Promise`\<`void`\>

Defined in: packages/txpool/types/TxPool.d.ts:207

**`Experimental`**

Handle chain reorganization

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

Open pool

#### Returns

`boolean`

***

### removeByHash()

> **removeByHash**(`txHash`): `void`

Defined in: packages/txpool/types/TxPool.d.ts:144

**`Experimental`**

Removes the given tx from the pool

#### Parameters

##### txHash

`string`

Hash of the transaction

#### Returns

`void`

***

### removeNewBlockTxs()

> **removeNewBlockTxs**(`newBlocks`): `void`

Defined in: packages/txpool/types/TxPool.d.ts:148

**`Experimental`**

Remove txs included in the latest blocks from the tx pool

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

Start tx processing

#### Returns

`boolean`

***

### stop()

> **stop**(): `boolean`

Defined in: packages/txpool/types/TxPool.d.ts:231

**`Experimental`**

Stop pool execution

#### Returns

`boolean`

***

### txsByPriceAndNonce()

> **txsByPriceAndNonce**(`baseFee?`): `Promise`\<([`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md))[]\>

Defined in: packages/txpool/types/TxPool.d.ts:224

**`Experimental`**

Returns eligible txs to be mined sorted by price in such a way that the
nonce orderings within a single account are maintained.

Note, this is not as trivial as it seems from the first look as there are three
different criteria that need to be taken into account (price, nonce, account
match), which cannot be done with any plain sorting method, as certain items
cannot be compared without context.

This method first sorts the separates the list of transactions into individual
sender accounts and sorts them by nonce. After the account nonce ordering is
satisfied, the results are merged back together by price, always comparing only
the head transaction from each account. This is done via a heap to keep it fast.

#### Parameters

##### baseFee?

Provide a baseFee to exclude txs with a lower gasPrice

###### allowedBlobs?

`number`

###### baseFee?

`bigint`

#### Returns

`Promise`\<([`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md))[]\>
