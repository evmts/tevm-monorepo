[**@tevm/txpool**](../README.md)

***

[@tevm/txpool](../globals.md) / TxPool

# Class: TxPool

Defined in: [TxPool.ts:73](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L73)

**`Experimental`**

Tx pool (mempool)

## Memberof

module:service

## Constructors

### new TxPool()

> **new TxPool**(`options`): [`TxPool`](TxPool.md)

Defined in: [TxPool.ts:143](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L143)

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

Defined in: [TxPool.ts:126](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L126)

**`Experimental`**

Activate before chain head is reached to start
tx pool preparation (sorting out included txs)

***

### gasMiningConfig?

> `optional` **gasMiningConfig**: `GasMiningConfig`

Defined in: [TxPool.ts:79](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L79)

**`Experimental`**

***

### HANDLED\_CLEANUP\_TIME\_LIMIT

> **HANDLED\_CLEANUP\_TIME\_LIMIT**: `number` = `60`

Defined in: [TxPool.ts:137](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L137)

**`Experimental`**

Number of minutes to forget about handled
txs (for cleanup/memory reasons)

***

### pool

> **pool**: `Map`\<`string`, `TxPoolObject`[]\>

Defined in: [TxPool.ts:90](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L90)

**`Experimental`**

The central pool dataset.

Maps an address to a `TxPoolObject`

***

### POOLED\_STORAGE\_TIME\_LIMIT

> **POOLED\_STORAGE\_TIME\_LIMIT**: `number` = `20`

Defined in: [TxPool.ts:131](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L131)

**`Experimental`**

Number of minutes to keep txs in the pool

***

### running

> **running**: `boolean`

Defined in: [TxPool.ts:78](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L78)

**`Experimental`**

***

### txsByHash

> **txsByHash**: `Map`\<`string`, `TypedTransaction`\>

Defined in: [TxPool.ts:100](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L100)

**`Experimental`**

Transactions by hash

***

### txsByNonce

> **txsByNonce**: `Map`\<`string`, `Map`\<`bigint`, `TypedTransaction`\>\>

Defined in: [TxPool.ts:105](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L105)

**`Experimental`**

Transactions by account and nonce

***

### txsInNonceOrder

> **txsInNonceOrder**: `Map`\<`string`, `TypedTransaction`[]\>

Defined in: [TxPool.ts:95](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L95)

**`Experimental`**

Transactions in nonce order for all senders

***

### txsInPool

> **txsInPool**: `number`

Defined in: [TxPool.ts:110](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L110)

**`Experimental`**

The number of txs currently in the pool

## Methods

### \_logPoolStats()

> **\_logPoolStats**(): `void`

Defined in: [TxPool.ts:844](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L844)

**`Experimental`**

#### Returns

`void`

***

### add()

> **add**(`tx`, `requireSignature`, `skipBalance`): `Promise`\<\{ `error`: `null`; `hash`: `` `0x${string}` ``; \} \| \{ `error`: `string`; `hash`: `` `0x${string}` ``; \}\>

Defined in: [TxPool.ts:369](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L369)

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

`Promise`\<\{ `error`: `null`; `hash`: `` `0x${string}` ``; \} \| \{ `error`: `string`; `hash`: `` `0x${string}` ``; \}\>

***

### addUnverified()

> **addUnverified**(`tx`): `Promise`\<\{ `error`: `null`; `hash`: `` `0x${string}` ``; \} \| \{ `error`: `string`; `hash`: `` `0x${string}` ``; \}\>

Defined in: [TxPool.ts:315](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L315)

**`Experimental`**

#### Parameters

##### tx

Transaction

`TypedTransaction` | `ImpersonatedTx`

#### Returns

`Promise`\<\{ `error`: `null`; `hash`: `` `0x${string}` ``; \} \| \{ `error`: `string`; `hash`: `` `0x${string}` ``; \}\>

***

### cleanup()

> **cleanup**(): `void`

Defined in: [TxPool.ts:492](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L492)

**`Experimental`**

#### Returns

`void`

***

### clear()

> **clear**(): `Promise`\<`void`\>

Defined in: [TxPool.ts:813](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L813)

**`Experimental`**

#### Returns

`Promise`\<`void`\>

***

### close()

> **close**(): `void`

Defined in: [TxPool.ts:800](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L800)

**`Experimental`**

#### Returns

`void`

***

### deepCopy()

> **deepCopy**(`opt`): [`TxPool`](TxPool.md)

Defined in: [TxPool.ts:159](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L159)

**`Experimental`**

#### Parameters

##### opt

`TxPoolOptions`

#### Returns

[`TxPool`](TxPool.md)

***

### getByHash()

> **getByHash**(`txHashes`): `null` \| `TypedTransaction` \| `ImpersonatedTx` \| TypedTransaction \| ImpersonatedTx[]

Defined in: [TxPool.ts:386](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L386)

**`Experimental`**

#### Parameters

##### txHashes

`string` | readonly `Uint8Array`\<`ArrayBufferLike`\>[]

#### Returns

`null` \| `TypedTransaction` \| `ImpersonatedTx` \| TypedTransaction \| ImpersonatedTx[]

Array with tx objects

***

### getBySenderAddress()

> **getBySenderAddress**(`address`): `Promise`\<`TxPoolObject`[]\>

Defined in: [TxPool.ts:574](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L574)

**`Experimental`**

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`TxPoolObject`[]\>

***

### getPendingTransactions()

> **getPendingTransactions**(): `Promise`\<(`TypedTransaction` \| `ImpersonatedTx`)[]\>

Defined in: [TxPool.ts:583](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L583)

**`Experimental`**

#### Returns

`Promise`\<(`TypedTransaction` \| `ImpersonatedTx`)[]\>

Array of transactions

***

### getTransactionStatus()

> **getTransactionStatus**(`txHash`): `Promise`\<`"pending"` \| `"mined"` \| `"unknown"`\>

Defined in: [TxPool.ts:596](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L596)

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

Defined in: [TxPool.ts:821](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L821)

**`Experimental`**

#### Returns

`void`

***

### on()

> **on**(`event`, `callback`): `void`

Defined in: [TxPool.ts:626](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L626)

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

Defined in: [TxPool.ts:650](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L650)

**`Experimental`**

#### Parameters

##### block

`Block`

The block that was added

#### Returns

`Promise`\<`void`\>

***

### onChainReorganization()

> **onChainReorganization**(`removedBlocks`, `addedBlocks`): `Promise`\<`void`\>

Defined in: [TxPool.ts:659](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L659)

**`Experimental`**

#### Parameters

##### removedBlocks

`Block`[]

Blocks that were removed from the canonical chain

##### addedBlocks

`Block`[]

Blocks that were added to the canonical chain

#### Returns

`Promise`\<`void`\>

***

### open()

> **open**(): `boolean`

Defined in: [TxPool.ts:176](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L176)

**`Experimental`**

#### Returns

`boolean`

***

### removeByHash()

> **removeByHash**(`txHash`): `void`

Defined in: [TxPool.ts:424](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L424)

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

Defined in: [TxPool.ts:475](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L475)

**`Experimental`**

#### Parameters

##### newBlocks

`Block`[]

#### Returns

`void`

***

### start()

> **start**(): `boolean`

Defined in: [TxPool.ts:188](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L188)

**`Experimental`**

#### Returns

`boolean`

***

### stop()

> **stop**(): `boolean`

Defined in: [TxPool.ts:789](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L789)

**`Experimental`**

#### Returns

`boolean`

***

### txsByPriceAndNonce()

> **txsByPriceAndNonce**(`baseFee`): `Promise`\<(`TypedTransaction` \| `ImpersonatedTx`)[]\>

Defined in: [TxPool.ts:696](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L696)

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
