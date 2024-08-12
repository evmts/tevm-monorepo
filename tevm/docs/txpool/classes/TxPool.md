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

#### Returns

`void`

#### Defined in

packages/txpool/types/TxPool.d.ts:121

***

### close()

> **close**(): `void`

**`Experimental`**

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

#### Returns

`boolean`

#### Defined in

packages/txpool/types/TxPool.d.ts:72

***

### removeByHash()

> **removeByHash**(`txHash`): `void`

**`Experimental`**

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

#### Returns

`boolean`

#### Defined in

packages/txpool/types/TxPool.d.ts:76

***

### stop()

> **stop**(): `boolean`

**`Experimental`**

#### Returns

`boolean`

#### Defined in

packages/txpool/types/TxPool.d.ts:161

***

### txsByPriceAndNonce()

> **txsByPriceAndNonce**(`baseFee`?): `Promise`\<([`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md))[]\>

**`Experimental`**

#### Parameters

• **baseFee?**

Provide a baseFee to exclude txs with a lower gasPrice

• **baseFee.allowedBlobs?**: `number`

• **baseFee.baseFee?**: `bigint`

#### Returns

`Promise`\<([`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md))[]\>

#### Defined in

packages/txpool/types/TxPool.d.ts:154
