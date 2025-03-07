[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [txpool](../README.md) / TxPool

# Class: TxPool

Defined in: packages/txpool/types/TxPool.d.ts:24

**`Experimental`**

Tx pool (mempool)

## Memberof

module:service

## Constructors

### new TxPool()

> **new TxPool**(`options`): [`TxPool`](TxPool.md)

Defined in: packages/txpool/types/TxPool.d.ts:67

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

Defined in: packages/txpool/types/TxPool.d.ts:53

**`Experimental`**

Activate before chain head is reached to start
tx pool preparation (sorting out included txs)

***

### HANDLED\_CLEANUP\_TIME\_LIMIT

> **HANDLED\_CLEANUP\_TIME\_LIMIT**: `number`

Defined in: packages/txpool/types/TxPool.d.ts:62

**`Experimental`**

Number of minutes to forget about handled
txs (for cleanup/memory reasons)

***

### pool

> **pool**: `Map`\<`string`, `TxPoolObject`[]\>

Defined in: packages/txpool/types/TxPool.d.ts:35

**`Experimental`**

The central pool dataset.

Maps an address to a `TxPoolObject`

***

### POOLED\_STORAGE\_TIME\_LIMIT

> **POOLED\_STORAGE\_TIME\_LIMIT**: `number`

Defined in: packages/txpool/types/TxPool.d.ts:57

**`Experimental`**

Number of minutes to keep txs in the pool

***

### running

> **running**: `boolean`

Defined in: packages/txpool/types/TxPool.d.ts:27

**`Experimental`**

***

### txsInPool

> **txsInPool**: `number`

Defined in: packages/txpool/types/TxPool.d.ts:39

**`Experimental`**

The number of txs currently in the pool

## Methods

### \_logPoolStats()

> **\_logPoolStats**(): `void`

Defined in: packages/txpool/types/TxPool.d.ts:166

**`Experimental`**

#### Returns

`void`

***

### add()

> **add**(`tx`, `requireSignature`?, `skipBalance`?): `Promise`\<`void`\>

Defined in: packages/txpool/types/TxPool.d.ts:102

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

`Promise`\<`void`\>

***

### addUnverified()

> **addUnverified**(`tx`): `Promise`\<`void`\>

Defined in: packages/txpool/types/TxPool.d.ts:92

**`Experimental`**

#### Parameters

##### tx

Transaction

[`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) | [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md)

#### Returns

`Promise`\<`void`\>

***

### cleanup()

> **cleanup**(): `void`

Defined in: packages/txpool/types/TxPool.d.ts:121

**`Experimental`**

#### Returns

`void`

***

### close()

> **close**(): `void`

Defined in: packages/txpool/types/TxPool.d.ts:165

**`Experimental`**

#### Returns

`void`

***

### deepCopy()

> **deepCopy**(`opt`): [`TxPool`](TxPool.md)

Defined in: packages/txpool/types/TxPool.d.ts:68

**`Experimental`**

#### Parameters

##### opt

`TxPoolOptions`

#### Returns

[`TxPool`](TxPool.md)

***

### getByHash()

> **getByHash**(`txHashes`): ([`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md))[]

Defined in: packages/txpool/types/TxPool.d.ts:108

**`Experimental`**

#### Parameters

##### txHashes

readonly `Uint8Array`\<`ArrayBufferLike`\>[]

#### Returns

([`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md))[]

Array with tx objects

***

### getBySenderAddress()

> **getBySenderAddress**(`address`): `Promise`\<`TxPoolObject`[]\>

Defined in: packages/txpool/types/TxPool.d.ts:137

**`Experimental`**

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<`TxPoolObject`[]\>

***

### open()

> **open**(): `boolean`

Defined in: packages/txpool/types/TxPool.d.ts:72

**`Experimental`**

#### Returns

`boolean`

***

### removeByHash()

> **removeByHash**(`txHash`): `void`

Defined in: packages/txpool/types/TxPool.d.ts:113

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

Defined in: packages/txpool/types/TxPool.d.ts:117

**`Experimental`**

#### Parameters

##### newBlocks

[`Block`](../../block/classes/Block.md)[]

#### Returns

`void`

***

### start()

> **start**(): `boolean`

Defined in: packages/txpool/types/TxPool.d.ts:76

**`Experimental`**

#### Returns

`boolean`

***

### stop()

> **stop**(): `boolean`

Defined in: packages/txpool/types/TxPool.d.ts:161

**`Experimental`**

#### Returns

`boolean`

***

### txsByPriceAndNonce()

> **txsByPriceAndNonce**(`baseFee`?): `Promise`\<([`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md))[]\>

Defined in: packages/txpool/types/TxPool.d.ts:154

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
