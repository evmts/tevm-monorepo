[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [txpool](../README.md) / TxPool

# Class: TxPool

**`Experimental`**

Tx pool (mempool)

## Memberof

module:service

## Constructors

### new TxPool()

> **new TxPool**(`options`): [`TxPool`](TxPool.md)

**`Experimental`**

Create new tx pool

#### Parameters

• **options**: `TxPoolOptions`

constructor parameters

#### Returns

[`TxPool`](TxPool.md)

#### Defined in

packages/txpool/types/TxPool.d.ts:67

## Properties

### BLOCKS\_BEFORE\_TARGET\_HEIGHT\_ACTIVATION

> **BLOCKS\_BEFORE\_TARGET\_HEIGHT\_ACTIVATION**: `number`

**`Experimental`**

Activate before chain head is reached to start
tx pool preparation (sorting out included txs)

#### Defined in

packages/txpool/types/TxPool.d.ts:53

***

### HANDLED\_CLEANUP\_TIME\_LIMIT

> **HANDLED\_CLEANUP\_TIME\_LIMIT**: `number`

**`Experimental`**

Number of minutes to forget about handled
txs (for cleanup/memory reasons)

#### Defined in

packages/txpool/types/TxPool.d.ts:62

***

### POOLED\_STORAGE\_TIME\_LIMIT

> **POOLED\_STORAGE\_TIME\_LIMIT**: `number`

**`Experimental`**

Number of minutes to keep txs in the pool

#### Defined in

packages/txpool/types/TxPool.d.ts:57

***

### pool

> **pool**: `Map`\<`string`, `TxPoolObject`[]\>

**`Experimental`**

The central pool dataset.

Maps an address to a `TxPoolObject`

#### Defined in

packages/txpool/types/TxPool.d.ts:35

***

### running

> **running**: `boolean`

**`Experimental`**

#### Defined in

packages/txpool/types/TxPool.d.ts:27

***

### txsInPool

> **txsInPool**: `number`

**`Experimental`**

The number of txs currently in the pool

#### Defined in

packages/txpool/types/TxPool.d.ts:39

## Methods

### \_logPoolStats()

> **\_logPoolStats**(): `void`

**`Experimental`**

#### Returns

`void`

#### Defined in

packages/txpool/types/TxPool.d.ts:166

***

### add()

> **add**(`tx`, `requireSignature`?, `skipBalance`?): `Promise`\<`void`\>

**`Experimental`**

Adds a tx to the pool.

If there is a tx in the pool with the same address and
nonce it will be replaced by the new tx, if it has a sufficient gas bump.
This also verifies certain constraints, if these are not met, tx will not be added to the pool.

#### Parameters

• **tx**: [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md)

Transaction

• **requireSignature?**: `boolean`

• **skipBalance?**: `boolean`

#### Returns

`Promise`\<`void`\>

#### Defined in

packages/txpool/types/TxPool.d.ts:102

***

### addUnverified()

> **addUnverified**(`tx`): `Promise`\<`void`\>

**`Experimental`**

Adds a tx to the pool without validating it.

If there is a tx in the pool with the same address and
nonce it will be replaced by the new tx, if it has a sufficient gas bump.
This also verifies certain constraints, if these are not met, tx will not be added to the pool.

#### Parameters

• **tx**: [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md)

Transaction

#### Returns

`Promise`\<`void`\>

#### Defined in

packages/txpool/types/TxPool.d.ts:92

***

### cleanup()

> **cleanup**(): `void`

**`Experimental`**

Regular tx pool cleanup

#### Returns

`void`

#### Defined in

packages/txpool/types/TxPool.d.ts:121

***

### close()

> **close**(): `void`

**`Experimental`**

Close pool

#### Returns

`void`

#### Defined in

packages/txpool/types/TxPool.d.ts:165

***

### deepCopy()

> **deepCopy**(`opt`): [`TxPool`](TxPool.md)

**`Experimental`**

#### Parameters

• **opt**: `TxPoolOptions`

#### Returns

[`TxPool`](TxPool.md)

#### Defined in

packages/txpool/types/TxPool.d.ts:68

***

### getByHash()

> **getByHash**(`txHashes`): ([`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md))[]

**`Experimental`**

Returns the available txs from the pool

#### Parameters

• **txHashes**: readonly `Uint8Array`[]

#### Returns

([`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md))[]

Array with tx objects

#### Defined in

packages/txpool/types/TxPool.d.ts:108

***

### getBySenderAddress()

> **getBySenderAddress**(`address`): `Promise`\<`TxPoolObject`[]\>

**`Experimental`**

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<`TxPoolObject`[]\>

#### Defined in

packages/txpool/types/TxPool.d.ts:137

***

### open()

> **open**(): `boolean`

**`Experimental`**

Open pool

#### Returns

`boolean`

#### Defined in

packages/txpool/types/TxPool.d.ts:72

***

### removeByHash()

> **removeByHash**(`txHash`): `void`

**`Experimental`**

Removes the given tx from the pool

#### Parameters

• **txHash**: `string`

Hash of the transaction

#### Returns

`void`

#### Defined in

packages/txpool/types/TxPool.d.ts:113

***

### removeNewBlockTxs()

> **removeNewBlockTxs**(`newBlocks`): `void`

**`Experimental`**

Remove txs included in the latest blocks from the tx pool

#### Parameters

• **newBlocks**: [`Block`](../../block/classes/Block.md)[]

#### Returns

`void`

#### Defined in

packages/txpool/types/TxPool.d.ts:117

***

### start()

> **start**(): `boolean`

**`Experimental`**

Start tx processing

#### Returns

`boolean`

#### Defined in

packages/txpool/types/TxPool.d.ts:76

***

### stop()

> **stop**(): `boolean`

**`Experimental`**

Stop pool execution

#### Returns

`boolean`

#### Defined in

packages/txpool/types/TxPool.d.ts:161

***

### txsByPriceAndNonce()

> **txsByPriceAndNonce**(`baseFee`?): `Promise`\<([`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md))[]\>

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

• **baseFee?**

Provide a baseFee to exclude txs with a lower gasPrice

• **baseFee.allowedBlobs?**: `number`

• **baseFee.baseFee?**: `bigint`

#### Returns

`Promise`\<([`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md))[]\>

#### Defined in

packages/txpool/types/TxPool.d.ts:154
