[**@tevm/txpool**](../README.md) • **Docs**

***

[@tevm/txpool](../globals.md) / TxPool

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

[TxPool.ts:118](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L118)

## Properties

### BLOCKS\_BEFORE\_TARGET\_HEIGHT\_ACTIVATION

> **BLOCKS\_BEFORE\_TARGET\_HEIGHT\_ACTIVATION**: `number` = `20`

**`Experimental`**

Activate before chain head is reached to start
tx pool preparation (sorting out included txs)

#### Defined in

[TxPool.ts:101](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L101)

***

### HANDLED\_CLEANUP\_TIME\_LIMIT

> **HANDLED\_CLEANUP\_TIME\_LIMIT**: `number` = `60`

**`Experimental`**

Number of minutes to forget about handled
txs (for cleanup/memory reasons)

#### Defined in

[TxPool.ts:112](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L112)

***

### POOLED\_STORAGE\_TIME\_LIMIT

> **POOLED\_STORAGE\_TIME\_LIMIT**: `number` = `20`

**`Experimental`**

Number of minutes to keep txs in the pool

#### Defined in

[TxPool.ts:106](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L106)

***

### pool

> **pool**: `Map`\<`string`, `TxPoolObject`[]\>

**`Experimental`**

The central pool dataset.

Maps an address to a `TxPoolObject`

#### Defined in

[TxPool.ts:80](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L80)

***

### running

> **running**: `boolean`

**`Experimental`**

#### Defined in

[TxPool.ts:69](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L69)

***

### txsInPool

> **txsInPool**: `number`

**`Experimental`**

The number of txs currently in the pool

#### Defined in

[TxPool.ts:85](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L85)

## Methods

### \_logPoolStats()

> **\_logPoolStats**(): `void`

**`Experimental`**

#### Returns

`void`

#### Defined in

[TxPool.ts:588](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L588)

***

### add()

> **add**(`tx`, `requireSignature`, `skipBalance`): `Promise`\<`void`\>

**`Experimental`**

Adds a tx to the pool.

If there is a tx in the pool with the same address and
nonce it will be replaced by the new tx, if it has a sufficient gas bump.
This also verifies certain constraints, if these are not met, tx will not be added to the pool.

#### Parameters

• **tx**: `TypedTransaction` \| `ImpersonatedTx`

Transaction

• **requireSignature**: `boolean` = `true`

• **skipBalance**: `boolean` = `false`

#### Returns

`Promise`\<`void`\>

#### Defined in

[TxPool.ts:310](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L310)

***

### addUnverified()

> **addUnverified**(`tx`): `Promise`\<`void`\>

**`Experimental`**

Adds a tx to the pool without validating it.

If there is a tx in the pool with the same address and
nonce it will be replaced by the new tx, if it has a sufficient gas bump.
This also verifies certain constraints, if these are not met, tx will not be added to the pool.

#### Parameters

• **tx**: `TypedTransaction` \| `ImpersonatedTx`

Transaction

#### Returns

`Promise`\<`void`\>

#### Defined in

[TxPool.ts:280](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L280)

***

### cleanup()

> **cleanup**(): `void`

**`Experimental`**

Regular tx pool cleanup

#### Returns

`void`

#### Defined in

[TxPool.ts:374](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L374)

***

### close()

> **close**(): `void`

**`Experimental`**

Close pool

#### Returns

`void`

#### Defined in

[TxPool.ts:581](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L581)

***

### deepCopy()

> **deepCopy**(`opt`): [`TxPool`](TxPool.md)

**`Experimental`**

#### Parameters

• **opt**: `TxPoolOptions`

#### Returns

[`TxPool`](TxPool.md)

#### Defined in

[TxPool.ts:128](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L128)

***

### getByHash()

> **getByHash**(`txHashes`): (`TypedTransaction` \| `ImpersonatedTx`)[]

**`Experimental`**

Returns the available txs from the pool

#### Parameters

• **txHashes**: readonly `Uint8Array`[]

#### Returns

(`TypedTransaction` \| `ImpersonatedTx`)[]

Array with tx objects

#### Defined in

[TxPool.ts:320](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L320)

***

### getBySenderAddress()

> **getBySenderAddress**(`address`): `Promise`\<`TxPoolObject`[]\>

**`Experimental`**

#### Parameters

• **address**: `Address`

#### Returns

`Promise`\<`TxPoolObject`[]\>

#### Defined in

[TxPool.ts:456](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L456)

***

### open()

> **open**(): `boolean`

**`Experimental`**

Open pool

#### Returns

`boolean`

#### Defined in

[TxPool.ts:141](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L141)

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

[TxPool.ts:341](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L341)

***

### removeNewBlockTxs()

> **removeNewBlockTxs**(`newBlocks`): `void`

**`Experimental`**

Remove txs included in the latest blocks from the tx pool

#### Parameters

• **newBlocks**: `Block`[]

#### Returns

`void`

#### Defined in

[TxPool.ts:361](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L361)

***

### start()

> **start**(): `boolean`

**`Experimental`**

Start tx processing

#### Returns

`boolean`

#### Defined in

[TxPool.ts:153](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L153)

***

### stop()

> **stop**(): `boolean`

**`Experimental`**

Stop pool execution

#### Returns

`boolean`

#### Defined in

[TxPool.ts:570](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L570)

***

### txsByPriceAndNonce()

> **txsByPriceAndNonce**(`baseFee`): `Promise`\<(`TypedTransaction` \| `ImpersonatedTx`)[]\>

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

• **baseFee** = `{}`

Provide a baseFee to exclude txs with a lower gasPrice

• **baseFee.allowedBlobs?**: `number`

• **baseFee.baseFee?**: `bigint`

#### Returns

`Promise`\<(`TypedTransaction` \| `ImpersonatedTx`)[]\>

#### Defined in

[TxPool.ts:477](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L477)
