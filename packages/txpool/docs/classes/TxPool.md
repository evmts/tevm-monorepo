[**@tevm/txpool**](../README.md)

***

[@tevm/txpool](../globals.md) / TxPool

# Class: TxPool

Defined in: [TxPool.ts:84](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L84)

**`Experimental`**

Tx pool (mempool)

## Memberof

module:service

## Constructors

### new TxPool()

> **new TxPool**(`options`): [`TxPool`](TxPool.md)

Defined in: [TxPool.ts:162](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L162)

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

Defined in: [TxPool.ts:145](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L145)

**`Experimental`**

Activate before chain head is reached to start
tx pool preparation (sorting out included txs)

***

### HANDLED\_CLEANUP\_TIME\_LIMIT

> **HANDLED\_CLEANUP\_TIME\_LIMIT**: `number` = `60`

Defined in: [TxPool.ts:156](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L156)

**`Experimental`**

Number of minutes to forget about handled
txs (for cleanup/memory reasons)

***

### pool

> **pool**: `Map`\<`string`, `TxPoolObject`[]\>

Defined in: [TxPool.ts:109](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L109)

**`Experimental`**

The central pool dataset.

Maps an address to a `TxPoolObject`

***

### POOLED\_STORAGE\_TIME\_LIMIT

> **POOLED\_STORAGE\_TIME\_LIMIT**: `number` = `20`

Defined in: [TxPool.ts:150](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L150)

**`Experimental`**

Number of minutes to keep txs in the pool

***

### running

> **running**: `boolean`

Defined in: [TxPool.ts:89](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L89)

**`Experimental`**

***

### txsByHash

> **txsByHash**: `Map`\<`string`, `TypedTransaction`\>

Defined in: [TxPool.ts:119](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L119)

**`Experimental`**

Transactions by hash

***

### txsByNonce

> **txsByNonce**: `Map`\<`string`, `Map`\<`bigint`, `TypedTransaction`\>\>

Defined in: [TxPool.ts:124](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L124)

**`Experimental`**

Transactions by account and nonce

***

### txsInNonceOrder

> **txsInNonceOrder**: `Map`\<`string`, `TypedTransaction`[]\>

Defined in: [TxPool.ts:114](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L114)

**`Experimental`**

Transactions in nonce order for all senders

***

### txsInPool

> **txsInPool**: `number`

Defined in: [TxPool.ts:129](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L129)

**`Experimental`**

The number of txs currently in the pool

## Methods

### \_logPoolStats()

> **\_logPoolStats**(): `void`

Defined in: [TxPool.ts:868](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L868)

**`Experimental`**

#### Returns

`void`

***

### add()

> **add**(`tx`, `requireSignature`, `skipBalance`): `Promise`\<\{ `error`: `null`; `hash`: `` `0x${string}` ``; \} \| \{ `error`: `string`; `hash`: `` `0x${string}` ``; \}\>

Defined in: [TxPool.ts:392](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L392)

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

Defined in: [TxPool.ts:333](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L333)

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

Defined in: [TxPool.ts:515](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L515)

**`Experimental`**

#### Returns

`void`

***

### clear()

> **clear**(): `Promise`\<`void`\>

Defined in: [TxPool.ts:837](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L837)

**`Experimental`**

#### Returns

`Promise`\<`void`\>

***

### close()

> **close**(): `void`

Defined in: [TxPool.ts:824](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L824)

**`Experimental`**

#### Returns

`void`

***

### configureGasMining()

> **configureGasMining**(`config`): `void`

Defined in: [TxPool.ts:876](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L876)

**`Experimental`**

#### Parameters

##### config

`GasMiningConfig`

Gas mining configuration

#### Returns

`void`

***

### deepCopy()

> **deepCopy**(`opt`): [`TxPool`](TxPool.md)

Defined in: [TxPool.ts:177](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L177)

**`Experimental`**

#### Parameters

##### opt

`TxPoolOptions`

#### Returns

[`TxPool`](TxPool.md)

***

### getByHash()

> **getByHash**(`txHashes`): `null` \| `TypedTransaction` \| `ImpersonatedTx` \| TypedTransaction \| ImpersonatedTx[]

Defined in: [TxPool.ts:409](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L409)

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

Defined in: [TxPool.ts:597](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L597)

**`Experimental`**

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`TxPoolObject`[]\>

***

### getPendingTransactions()

> **getPendingTransactions**(): `Promise`\<(`TypedTransaction` \| `ImpersonatedTx`)[]\>

Defined in: [TxPool.ts:606](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L606)

**`Experimental`**

#### Returns

`Promise`\<(`TypedTransaction` \| `ImpersonatedTx`)[]\>

Array of transactions

***

### getTransactionStatus()

> **getTransactionStatus**(`txHash`): `Promise`\<`"pending"` \| `"mined"` \| `"unknown"`\>

Defined in: [TxPool.ts:619](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L619)

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

Defined in: [TxPool.ts:845](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L845)

**`Experimental`**

#### Returns

`void`

***

### on()

> **on**(`event`, `callback`): `void`

Defined in: [TxPool.ts:650](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L650)

**`Experimental`**

#### Parameters

##### event

Event name ('txadded' or 'txremoved')

`"txadded"` | `"txremoved"` | `"gasminingneeded"`

##### callback

(`hash`) => `void`

Handler function

#### Returns

`void`

***

### onBlockAdded()

> **onBlockAdded**(`block`): `Promise`\<`void`\>

Defined in: [TxPool.ts:674](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L674)

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

Defined in: [TxPool.ts:683](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L683)

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

Defined in: [TxPool.ts:194](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L194)

**`Experimental`**

#### Returns

`boolean`

***

### removeByHash()

> **removeByHash**(`txHash`): `void`

Defined in: [TxPool.ts:447](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L447)

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

Defined in: [TxPool.ts:498](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L498)

**`Experimental`**

#### Parameters

##### newBlocks

`Block`[]

#### Returns

`void`

***

### start()

> **start**(): `boolean`

Defined in: [TxPool.ts:206](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L206)

**`Experimental`**

#### Returns

`boolean`

***

### stop()

> **stop**(): `boolean`

Defined in: [TxPool.ts:813](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L813)

**`Experimental`**

#### Returns

`boolean`

***

### txsByPriceAndNonce()

> **txsByPriceAndNonce**(`baseFee`): `Promise`\<(`TypedTransaction` \| `ImpersonatedTx`)[]\>

Defined in: [TxPool.ts:720](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L720)

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
