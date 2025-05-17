[**@tevm/txpool**](../README.md)

***

[@tevm/txpool](../globals.md) / TxPool

# Class: TxPool

Defined in: [TxPool.ts:66](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L66)

**`Experimental`**

Tx pool (mempool)

## Memberof

module:service

## Constructors

### Constructor

> **new TxPool**(`options`): `TxPool`

Defined in: [TxPool.ts:135](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L135)

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

Defined in: [TxPool.ts:118](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L118)

**`Experimental`**

Activate before chain head is reached to start
tx pool preparation (sorting out included txs)

***

### HANDLED\_CLEANUP\_TIME\_LIMIT

> **HANDLED\_CLEANUP\_TIME\_LIMIT**: `number` = `60`

Defined in: [TxPool.ts:129](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L129)

**`Experimental`**

Number of minutes to forget about handled
txs (for cleanup/memory reasons)

***

### pool

> **pool**: `Map`\<`string`, `TxPoolObject`[]\>

Defined in: [TxPool.ts:82](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L82)

**`Experimental`**

The central pool dataset.

Maps an address to a `TxPoolObject`

***

### POOLED\_STORAGE\_TIME\_LIMIT

> **POOLED\_STORAGE\_TIME\_LIMIT**: `number` = `20`

Defined in: [TxPool.ts:123](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L123)

**`Experimental`**

Number of minutes to keep txs in the pool

***

### running

> **running**: `boolean`

Defined in: [TxPool.ts:71](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L71)

**`Experimental`**

***

### txsByHash

> **txsByHash**: `Map`\<`string`, `TypedTransaction`\>

Defined in: [TxPool.ts:92](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L92)

**`Experimental`**

Transactions by hash

***

### txsByNonce

> **txsByNonce**: `Map`\<`string`, `Map`\<`bigint`, `TypedTransaction`\>\>

Defined in: [TxPool.ts:97](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L97)

**`Experimental`**

Transactions by account and nonce

***

### txsInNonceOrder

> **txsInNonceOrder**: `Map`\<`string`, `TypedTransaction`[]\>

Defined in: [TxPool.ts:87](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L87)

**`Experimental`**

Transactions in nonce order for all senders

***

### txsInPool

> **txsInPool**: `number`

Defined in: [TxPool.ts:102](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L102)

**`Experimental`**

The number of txs currently in the pool

## Methods

### \_logPoolStats()

> **\_logPoolStats**(): `void`

Defined in: [TxPool.ts:833](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L833)

**`Experimental`**

#### Returns

`void`

***

### add()

> **add**(`tx`, `requireSignature`, `skipBalance`): `Promise`\<\{ `error`: `null`; `hash`: `` `0x${string}` ``; \} \| \{ `error`: `string`; `hash`: `` `0x${string}` ``; \}\>

Defined in: [TxPool.ts:359](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L359)

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

Defined in: [TxPool.ts:305](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L305)

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

Defined in: [TxPool.ts:484](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L484)

**`Experimental`**

#### Returns

`void`

***

### clear()

> **clear**(): `Promise`\<`void`\>

Defined in: [TxPool.ts:802](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L802)

**`Experimental`**

#### Returns

`Promise`\<`void`\>

***

### close()

> **close**(): `void`

Defined in: [TxPool.ts:789](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L789)

**`Experimental`**

#### Returns

`void`

***

### deepCopy()

> **deepCopy**(`opt`): `TxPool`

Defined in: [TxPool.ts:150](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L150)

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

Defined in: [TxPool.ts:376](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L376)

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

Defined in: [TxPool.ts:377](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L377)

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

Defined in: [TxPool.ts:566](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L566)

**`Experimental`**

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`TxPoolObject`[]\>

***

### getPendingTransactions()

> **getPendingTransactions**(): `Promise`\<(`TypedTransaction` \| `ImpersonatedTx`)[]\>

Defined in: [TxPool.ts:575](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L575)

**`Experimental`**

#### Returns

`Promise`\<(`TypedTransaction` \| `ImpersonatedTx`)[]\>

Array of transactions

***

### getTransactionStatus()

> **getTransactionStatus**(`txHash`): `Promise`\<`"pending"` \| `"mined"` \| `"unknown"`\>

Defined in: [TxPool.ts:588](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L588)

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

Defined in: [TxPool.ts:810](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L810)

**`Experimental`**

#### Returns

`void`

***

### on()

> **on**(`event`, `callback`): `void`

Defined in: [TxPool.ts:618](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L618)

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

Defined in: [TxPool.ts:642](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L642)

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

Defined in: [TxPool.ts:651](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L651)

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

Defined in: [TxPool.ts:166](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L166)

**`Experimental`**

#### Returns

`boolean`

***

### removeByHash()

> **removeByHash**(`txHash`): `void`

Defined in: [TxPool.ts:416](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L416)

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

Defined in: [TxPool.ts:471](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L471)

**`Experimental`**

#### Parameters

##### newBlocks

`Block`[]

#### Returns

`void`

***

### start()

> **start**(): `boolean`

Defined in: [TxPool.ts:178](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L178)

**`Experimental`**

#### Returns

`boolean`

***

### stop()

> **stop**(): `boolean`

Defined in: [TxPool.ts:778](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L778)

**`Experimental`**

#### Returns

`boolean`

***

### txsByPriceAndNonce()

> **txsByPriceAndNonce**(`baseFee`): `Promise`\<(`TypedTransaction` \| `ImpersonatedTx`)[]\>

Defined in: [TxPool.ts:685](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L685)

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
