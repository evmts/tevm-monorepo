---
editUrl: false
next: false
prev: false
title: "TxPool"
---

Tx pool (mempool)

## Memberof

module:service

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

## Constructors

### new TxPool()

> **new TxPool**(`options`): [`TxPool`](/reference/tevm/txpool/classes/txpool/)

Create new tx pool

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

#### Parameters

• **options**: `TxPoolOptions`

constructor parameters

#### Returns

[`TxPool`](/reference/tevm/txpool/classes/txpool/)

#### Defined in

[TxPool.ts:118](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L118)

## Properties

### BLOCKS\_BEFORE\_TARGET\_HEIGHT\_ACTIVATION

> **BLOCKS\_BEFORE\_TARGET\_HEIGHT\_ACTIVATION**: `number` = `20`

Activate before chain head is reached to start
tx pool preparation (sorting out included txs)

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

#### Defined in

[TxPool.ts:101](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L101)

***

### HANDLED\_CLEANUP\_TIME\_LIMIT

> **HANDLED\_CLEANUP\_TIME\_LIMIT**: `number` = `60`

Number of minutes to forget about handled
txs (for cleanup/memory reasons)

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

#### Defined in

[TxPool.ts:112](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L112)

***

### POOLED\_STORAGE\_TIME\_LIMIT

> **POOLED\_STORAGE\_TIME\_LIMIT**: `number` = `20`

Number of minutes to keep txs in the pool

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

#### Defined in

[TxPool.ts:106](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L106)

***

### pool

> **pool**: `Map`\<`string`, `TxPoolObject`[]\>

The central pool dataset.

Maps an address to a `TxPoolObject`

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

#### Defined in

[TxPool.ts:80](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L80)

***

### running

> **running**: `boolean`

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

#### Defined in

[TxPool.ts:69](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L69)

***

### txsInPool

> **txsInPool**: `number`

The number of txs currently in the pool

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

#### Defined in

[TxPool.ts:85](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L85)

## Methods

### \_logPoolStats()

> **\_logPoolStats**(): `void`

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

#### Returns

`void`

#### Defined in

[TxPool.ts:588](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L588)

***

### add()

> **add**(`tx`, `requireSignature`, `skipBalance`): `Promise`\<`void`\>

Adds a tx to the pool.

If there is a tx in the pool with the same address and
nonce it will be replaced by the new tx, if it has a sufficient gas bump.
This also verifies certain constraints, if these are not met, tx will not be added to the pool.

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

#### Parameters

• **tx**: [`TypedTransaction`](/reference/tevm/tx/type-aliases/typedtransaction/) \| [`ImpersonatedTx`](/reference/tevm/tx/interfaces/impersonatedtx/)

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

Adds a tx to the pool without validating it.

If there is a tx in the pool with the same address and
nonce it will be replaced by the new tx, if it has a sufficient gas bump.
This also verifies certain constraints, if these are not met, tx will not be added to the pool.

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

#### Parameters

• **tx**: [`TypedTransaction`](/reference/tevm/tx/type-aliases/typedtransaction/) \| [`ImpersonatedTx`](/reference/tevm/tx/interfaces/impersonatedtx/)

Transaction

#### Returns

`Promise`\<`void`\>

#### Defined in

[TxPool.ts:280](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L280)

***

### cleanup()

> **cleanup**(): `void`

Regular tx pool cleanup

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

#### Returns

`void`

#### Defined in

[TxPool.ts:374](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L374)

***

### close()

> **close**(): `void`

Close pool

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

#### Returns

`void`

#### Defined in

[TxPool.ts:581](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L581)

***

### deepCopy()

> **deepCopy**(`opt`): [`TxPool`](/reference/tevm/txpool/classes/txpool/)

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

#### Parameters

• **opt**: `TxPoolOptions`

#### Returns

[`TxPool`](/reference/tevm/txpool/classes/txpool/)

#### Defined in

[TxPool.ts:128](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L128)

***

### getByHash()

> **getByHash**(`txHashes`): ([`TypedTransaction`](/reference/tevm/tx/type-aliases/typedtransaction/) \| [`ImpersonatedTx`](/reference/tevm/tx/interfaces/impersonatedtx/))[]

Returns the available txs from the pool

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

#### Parameters

• **txHashes**: readonly `Uint8Array`[]

#### Returns

([`TypedTransaction`](/reference/tevm/tx/type-aliases/typedtransaction/) \| [`ImpersonatedTx`](/reference/tevm/tx/interfaces/impersonatedtx/))[]

Array with tx objects

#### Defined in

[TxPool.ts:320](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L320)

***

### getBySenderAddress()

> **getBySenderAddress**(`address`): `Promise`\<`TxPoolObject`[]\>

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

#### Parameters

• **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Returns

`Promise`\<`TxPoolObject`[]\>

#### Defined in

[TxPool.ts:456](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L456)

***

### open()

> **open**(): `boolean`

Open pool

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

#### Returns

`boolean`

#### Defined in

[TxPool.ts:141](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L141)

***

### removeByHash()

> **removeByHash**(`txHash`): `void`

Removes the given tx from the pool

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

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

Remove txs included in the latest blocks from the tx pool

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

#### Parameters

• **newBlocks**: [`Block`](/reference/tevm/block/classes/block/)[]

#### Returns

`void`

#### Defined in

[TxPool.ts:361](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L361)

***

### start()

> **start**(): `boolean`

Start tx processing

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

#### Returns

`boolean`

#### Defined in

[TxPool.ts:153](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L153)

***

### stop()

> **stop**(): `boolean`

Stop pool execution

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

#### Returns

`boolean`

#### Defined in

[TxPool.ts:570](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L570)

***

### txsByPriceAndNonce()

> **txsByPriceAndNonce**(`baseFee`): `Promise`\<([`TypedTransaction`](/reference/tevm/tx/type-aliases/typedtransaction/) \| [`ImpersonatedTx`](/reference/tevm/tx/interfaces/impersonatedtx/))[]\>

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

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

#### Parameters

• **baseFee** = `{}`

Provide a baseFee to exclude txs with a lower gasPrice

• **baseFee.allowedBlobs?**: `number`

• **baseFee.baseFee?**: `bigint`

#### Returns

`Promise`\<([`TypedTransaction`](/reference/tevm/tx/type-aliases/typedtransaction/) \| [`ImpersonatedTx`](/reference/tevm/tx/interfaces/impersonatedtx/))[]\>

#### Defined in

[TxPool.ts:477](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L477)
