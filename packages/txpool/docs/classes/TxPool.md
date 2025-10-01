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

### Constructor

> **new TxPool**(`options`): `TxPool`

Defined in: [TxPool.ts:133](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L133)

**`Experimental`**

#### Parameters

##### options

`TxPoolOptions`

constructor parameters

#### Returns

`TxPool`

## Properties

### BLOCKS\_BEFORE\_TARGET\_HEIGHT\_ACTIVATION

> **BLOCKS\_BEFORE\_TARGET\_HEIGHT\_ACTIVATION**: `number` = `20`

Defined in: [TxPool.ts:116](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L116)

**`Experimental`**

Activate before chain head is reached to start
tx pool preparation (sorting out included txs)

***

### HANDLED\_CLEANUP\_TIME\_LIMIT

> **HANDLED\_CLEANUP\_TIME\_LIMIT**: `number` = `60`

Defined in: [TxPool.ts:127](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L127)

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

Defined in: [TxPool.ts:121](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L121)

**`Experimental`**

Number of minutes to keep txs in the pool

***

### running

> **running**: `boolean`

Defined in: [TxPool.ts:69](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L69)

**`Experimental`**

***

### txsByHash

> **txsByHash**: `Map`\<`string`, `TypedTransaction`\>

Defined in: [TxPool.ts:90](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L90)

**`Experimental`**

Transactions by hash

***

### txsByNonce

> **txsByNonce**: `Map`\<`string`, `Map`\<`bigint`, `TypedTransaction`\>\>

Defined in: [TxPool.ts:95](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L95)

**`Experimental`**

Transactions by account and nonce

***

### txsInNonceOrder

> **txsInNonceOrder**: `Map`\<`string`, `TypedTransaction`[]\>

Defined in: [TxPool.ts:85](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L85)

**`Experimental`**

Transactions in nonce order for all senders

***

### txsInPool

> **txsInPool**: `number`

Defined in: [TxPool.ts:100](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L100)

**`Experimental`**

The number of txs currently in the pool

## Methods

### \_logPoolStats()

> **\_logPoolStats**(): `void`

Defined in: [TxPool.ts:831](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L831)

**`Experimental`**

#### Returns

`void`

***

### add()

> **add**(`tx`, `requireSignature`, `skipBalance`): `Promise`\<\{ `error`: `null`; `hash`: `` `0x${string}` ``; \} \| \{ `error`: `string`; `hash`: `` `0x${string}` ``; \}\>

Defined in: [TxPool.ts:357](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L357)

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

Defined in: [TxPool.ts:303](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L303)

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

Defined in: [TxPool.ts:482](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L482)

**`Experimental`**

#### Returns

`void`

***

### clear()

> **clear**(): `Promise`\<`void`\>

Defined in: [TxPool.ts:800](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L800)

**`Experimental`**

#### Returns

`Promise`\<`void`\>

***

### close()

> **close**(): `void`

Defined in: [TxPool.ts:787](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L787)

**`Experimental`**

#### Returns

`void`

***

### deepCopy()

> **deepCopy**(`opt`): `TxPool`

Defined in: [TxPool.ts:148](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L148)

**`Experimental`**

#### Parameters

##### opt

`TxPoolOptions`

#### Returns

`TxPool`

***

### getByHash()

#### Call Signature

> **getByHash**(`txHashes`): `null` \| `TypedTransaction` \| `ImpersonatedTx`

Defined in: [TxPool.ts:374](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L374)

**`Experimental`**

Returns the available txs from the pool

##### Parameters

###### txHashes

`string`

##### Returns

`null` \| `TypedTransaction` \| `ImpersonatedTx`

Array with tx objects

#### Call Signature

> **getByHash**(`txHashes`): (`TypedTransaction` \| `ImpersonatedTx`)[]

Defined in: [TxPool.ts:375](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L375)

**`Experimental`**

Returns the available txs from the pool

##### Parameters

###### txHashes

readonly `Uint8Array`\<`ArrayBufferLike`\>[]

##### Returns

(`TypedTransaction` \| `ImpersonatedTx`)[]

Array with tx objects

***

### getBySenderAddress()

> **getBySenderAddress**(`address`): `Promise`\<`TxPoolObject`[]\>

Defined in: [TxPool.ts:564](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L564)

**`Experimental`**

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`TxPoolObject`[]\>

***

### getPendingTransactions()

> **getPendingTransactions**(): `Promise`\<(`TypedTransaction` \| `ImpersonatedTx`)[]\>

Defined in: [TxPool.ts:573](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L573)

**`Experimental`**

#### Returns

`Promise`\<(`TypedTransaction` \| `ImpersonatedTx`)[]\>

Array of transactions

***

### getTransactionStatus()

> **getTransactionStatus**(`txHash`): `Promise`\<`"pending"` \| `"mined"` \| `"unknown"`\>

Defined in: [TxPool.ts:586](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L586)

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

Defined in: [TxPool.ts:808](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L808)

**`Experimental`**

#### Returns

`void`

***

### on()

> **on**(`event`, `callback`): `void`

Defined in: [TxPool.ts:616](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L616)

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

Defined in: [TxPool.ts:640](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L640)

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

Defined in: [TxPool.ts:649](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L649)

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

Defined in: [TxPool.ts:164](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L164)

**`Experimental`**

#### Returns

`boolean`

***

### removeByHash()

> **removeByHash**(`txHash`): `void`

Defined in: [TxPool.ts:414](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L414)

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

Defined in: [TxPool.ts:469](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L469)

**`Experimental`**

#### Parameters

##### newBlocks

`Block`[]

#### Returns

`void`

***

### start()

> **start**(): `boolean`

Defined in: [TxPool.ts:176](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L176)

**`Experimental`**

#### Returns

`boolean`

***

### stop()

> **stop**(): `boolean`

Defined in: [TxPool.ts:776](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L776)

**`Experimental`**

#### Returns

`boolean`

***

### txsByPriceAndNonce()

> **txsByPriceAndNonce**(`baseFee`): `Promise`\<(`TypedTransaction` \| `ImpersonatedTx`)[]\>

Defined in: [TxPool.ts:683](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L683)

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
