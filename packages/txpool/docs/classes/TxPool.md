[**@tevm/txpool**](../README.md)

***

[@tevm/txpool](../globals.md) / TxPool

# Class: TxPool

Defined in: [TxPool.ts:64](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L64)

**`Experimental`**

Tx pool (mempool)

## Memberof

module:service

## Constructors

### new TxPool()

> **new TxPool**(`options`): [`TxPool`](TxPool.md)

Defined in: [TxPool.ts:118](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L118)

**`Experimental`**

#### Parameters

##### options

`TxPoolOptions`

constructor parameters

#### Returns

[`TxPool`](TxPool.md)

## Properties

### BLOCKS\_BEFORE\_TARGET\_HEIGHT\_ACTIVATION

> **BLOCKS\_BEFORE\_TARGET\_HEIGHT\_ACTIVATION**: `number` = `20`

Defined in: [TxPool.ts:101](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L101)

**`Experimental`**

Activate before chain head is reached to start
tx pool preparation (sorting out included txs)

***

### HANDLED\_CLEANUP\_TIME\_LIMIT

> **HANDLED\_CLEANUP\_TIME\_LIMIT**: `number` = `60`

Defined in: [TxPool.ts:112](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L112)

**`Experimental`**

Number of minutes to forget about handled
txs (for cleanup/memory reasons)

***

### pool

> **pool**: `Map`\<`string`, `TxPoolObject`[]\>

Defined in: [TxPool.ts:80](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L80)

**`Experimental`**

The central pool dataset.

Maps an address to a `TxPoolObject`

***

### POOLED\_STORAGE\_TIME\_LIMIT

> **POOLED\_STORAGE\_TIME\_LIMIT**: `number` = `20`

Defined in: [TxPool.ts:106](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L106)

**`Experimental`**

Number of minutes to keep txs in the pool

***

### running

> **running**: `boolean`

Defined in: [TxPool.ts:69](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L69)

**`Experimental`**

***

### txsInPool

> **txsInPool**: `number`

Defined in: [TxPool.ts:85](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L85)

**`Experimental`**

The number of txs currently in the pool

## Methods

### \_logPoolStats()

> **\_logPoolStats**(): `void`

Defined in: [TxPool.ts:588](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L588)

**`Experimental`**

#### Returns

`void`

***

### add()

> **add**(`tx`, `requireSignature`, `skipBalance`): `Promise`\<`void`\>

Defined in: [TxPool.ts:310](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L310)

**`Experimental`**

#### Parameters

##### tx

Transaction

`TypedTransaction` | `ImpersonatedTx`

##### requireSignature

`boolean` = `true`

##### skipBalance

`boolean` = `false`

#### Returns

`Promise`\<`void`\>

***

### addUnverified()

> **addUnverified**(`tx`): `Promise`\<`void`\>

Defined in: [TxPool.ts:280](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L280)

**`Experimental`**

#### Parameters

##### tx

Transaction

`TypedTransaction` | `ImpersonatedTx`

#### Returns

`Promise`\<`void`\>

***

### cleanup()

> **cleanup**(): `void`

Defined in: [TxPool.ts:374](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L374)

**`Experimental`**

#### Returns

`void`

***

### close()

> **close**(): `void`

Defined in: [TxPool.ts:581](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L581)

**`Experimental`**

#### Returns

`void`

***

### deepCopy()

> **deepCopy**(`opt`): [`TxPool`](TxPool.md)

Defined in: [TxPool.ts:128](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L128)

**`Experimental`**

#### Parameters

##### opt

`TxPoolOptions`

#### Returns

[`TxPool`](TxPool.md)

***

### getByHash()

> **getByHash**(`txHashes`): (`TypedTransaction` \| `ImpersonatedTx`)[]

Defined in: [TxPool.ts:320](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L320)

**`Experimental`**

#### Parameters

##### txHashes

readonly `Uint8Array`\<`ArrayBufferLike`\>[]

#### Returns

(`TypedTransaction` \| `ImpersonatedTx`)[]

Array with tx objects

***

### getBySenderAddress()

> **getBySenderAddress**(`address`): `Promise`\<`TxPoolObject`[]\>

Defined in: [TxPool.ts:456](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L456)

**`Experimental`**

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`TxPoolObject`[]\>

***

### open()

> **open**(): `boolean`

Defined in: [TxPool.ts:141](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L141)

**`Experimental`**

#### Returns

`boolean`

***

### removeByHash()

> **removeByHash**(`txHash`): `void`

Defined in: [TxPool.ts:341](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L341)

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

Defined in: [TxPool.ts:361](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L361)

**`Experimental`**

#### Parameters

##### newBlocks

`Block`[]

#### Returns

`void`

***

### start()

> **start**(): `boolean`

Defined in: [TxPool.ts:153](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L153)

**`Experimental`**

#### Returns

`boolean`

***

### stop()

> **stop**(): `boolean`

Defined in: [TxPool.ts:570](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L570)

**`Experimental`**

#### Returns

`boolean`

***

### txsByPriceAndNonce()

> **txsByPriceAndNonce**(`baseFee`): `Promise`\<(`TypedTransaction` \| `ImpersonatedTx`)[]\>

Defined in: [TxPool.ts:477](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L477)

**`Experimental`**

#### Parameters

##### baseFee

Provide a baseFee to exclude txs with a lower gasPrice

###### allowedBlobs?

`number`

###### baseFee?

`bigint`

#### Returns

`Promise`\<(`TypedTransaction` \| `ImpersonatedTx`)[]\>
