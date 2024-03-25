[@tevm/txpool](../README.md) / [Exports](../modules.md) / TxPool

# Class: TxPool

Tx pool (mempool)

**`Memberof`**

module:service

## Table of contents

### Constructors

- [constructor](TxPool.md#constructor)

### Properties

- [BLOCKS\_BEFORE\_TARGET\_HEIGHT\_ACTIVATION](TxPool.md#blocks_before_target_height_activation)
- [HANDLED\_CLEANUP\_TIME\_LIMIT](TxPool.md#handled_cleanup_time_limit)
- [POOLED\_STORAGE\_TIME\_LIMIT](TxPool.md#pooled_storage_time_limit)
- [\_cleanupInterval](TxPool.md#_cleanupinterval)
- [\_logInterval](TxPool.md#_loginterval)
- [handled](TxPool.md#handled)
- [opened](TxPool.md#opened)
- [pool](TxPool.md#pool)
- [running](TxPool.md#running)
- [txsInPool](TxPool.md#txsinpool)
- [vm](TxPool.md#vm)

### Methods

- [\_logPoolStats](TxPool.md#_logpoolstats)
- [add](TxPool.md#add)
- [addUnverified](TxPool.md#addunverified)
- [cleanup](TxPool.md#cleanup)
- [close](TxPool.md#close)
- [getByHash](TxPool.md#getbyhash)
- [normalizedGasPrice](TxPool.md#normalizedgasprice)
- [open](TxPool.md#open)
- [removeByHash](TxPool.md#removebyhash)
- [removeNewBlockTxs](TxPool.md#removenewblocktxs)
- [start](TxPool.md#start)
- [stop](TxPool.md#stop)
- [txGasPrice](TxPool.md#txgasprice)
- [txsByPriceAndNonce](TxPool.md#txsbypriceandnonce)
- [validate](TxPool.md#validate)
- [validateTxGasBump](TxPool.md#validatetxgasbump)

## Constructors

### constructor

• **new TxPool**(`options`): [`TxPool`](TxPool.md)

Create new tx pool

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `TxPoolOptions` | constructor parameters |

#### Returns

[`TxPool`](TxPool.md)

#### Defined in

[TxPool.ts:124](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L124)

## Properties

### BLOCKS\_BEFORE\_TARGET\_HEIGHT\_ACTIVATION

• **BLOCKS\_BEFORE\_TARGET\_HEIGHT\_ACTIVATION**: `number` = `20`

Activate before chain head is reached to start
tx pool preparation (sorting out included txs)

#### Defined in

[TxPool.ts:107](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L107)

___

### HANDLED\_CLEANUP\_TIME\_LIMIT

• **HANDLED\_CLEANUP\_TIME\_LIMIT**: `number` = `60`

Number of minutes to forget about handled
txs (for cleanup/memory reasons)

#### Defined in

[TxPool.ts:118](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L118)

___

### POOLED\_STORAGE\_TIME\_LIMIT

• **POOLED\_STORAGE\_TIME\_LIMIT**: `number` = `20`

Number of minutes to keep txs in the pool

#### Defined in

[TxPool.ts:112](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L112)

___

### \_cleanupInterval

• `Private` **\_cleanupInterval**: `undefined` \| `Timer`

#### Defined in

[TxPool.ts:78](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L78)

___

### \_logInterval

• `Private` **\_logInterval**: `undefined` \| `Timer`

#### Defined in

[TxPool.ts:79](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L79)

___

### handled

• `Private` **handled**: `Map`\<`string`, `HandledObject`\>

Map for handled tx hashes
(have been added to the pool at some point)

This is meant to be a superset of the tx pool
so at any point it time containing minimally
all txs from the pool.

#### Defined in

[TxPool.ts:101](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L101)

___

### opened

• `Private` **opened**: `boolean`

#### Defined in

[TxPool.ts:73](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L73)

___

### pool

• **pool**: `Map`\<`string`, `TxPoolObject`[]\>

The central pool dataset.

Maps an address to a `TxPoolObject`

#### Defined in

[TxPool.ts:86](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L86)

___

### running

• **running**: `boolean`

#### Defined in

[TxPool.ts:75](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L75)

___

### txsInPool

• **txsInPool**: `number`

The number of txs currently in the pool

#### Defined in

[TxPool.ts:91](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L91)

___

### vm

• `Private` **vm**: `TevmVm`

#### Defined in

[TxPool.ts:71](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L71)

## Methods

### \_logPoolStats

▸ **_logPoolStats**(): `void`

#### Returns

`void`

#### Defined in

[TxPool.ts:615](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L615)

___

### add

▸ **add**(`tx`): `Promise`\<`void`\>

Adds a tx to the pool.

If there is a tx in the pool with the same address and
nonce it will be replaced by the new tx, if it has a sufficient gas bump.
This also verifies certain constraints, if these are not met, tx will not be added to the pool.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tx` | `TypedTransaction` | Transaction |

#### Returns

`Promise`\<`void`\>

#### Defined in

[TxPool.ts:330](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L330)

___

### addUnverified

▸ **addUnverified**(`tx`): `Promise`\<`void`\>

Adds a tx to the pool without validating it.

If there is a tx in the pool with the same address and
nonce it will be replaced by the new tx, if it has a sufficient gas bump.
This also verifies certain constraints, if these are not met, tx will not be added to the pool.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tx` | `TypedTransaction` | Transaction |

#### Returns

`Promise`\<`void`\>

#### Defined in

[TxPool.ts:300](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L300)

___

### cleanup

▸ **cleanup**(): `void`

Regular tx pool cleanup

#### Returns

`void`

#### Defined in

[TxPool.ts:398](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L398)

___

### close

▸ **close**(): `void`

Close pool

#### Returns

`void`

#### Defined in

[TxPool.ts:608](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L608)

___

### getByHash

▸ **getByHash**(`txHashes`): `TypedTransaction`[]

Returns the available txs from the pool

#### Parameters

| Name | Type |
| :------ | :------ |
| `txHashes` | `Uint8Array`[] |

#### Returns

`TypedTransaction`[]

Array with tx objects

#### Defined in

[TxPool.ts:340](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L340)

___

### normalizedGasPrice

▸ **normalizedGasPrice**(`tx`, `baseFee?`): `bigint`

Helper to return a normalized gas price across different
transaction types. Providing the baseFee param returns the
priority tip, and omitting it returns the max total fee.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tx` | `TypedTransaction` | The tx |
| `baseFee?` | `bigint` | Provide a baseFee to subtract from the legacy gasPrice to determine the leftover priority tip. |

#### Returns

`bigint`

#### Defined in

[TxPool.ts:432](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L432)

___

### open

▸ **open**(): `boolean`

Open pool

#### Returns

`boolean`

#### Defined in

[TxPool.ts:137](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L137)

___

### removeByHash

▸ **removeByHash**(`txHash`): `void`

Removes the given tx from the pool

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `txHash` | `string` | Hash of the transaction |

#### Returns

`void`

#### Defined in

[TxPool.ts:363](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L363)

___

### removeNewBlockTxs

▸ **removeNewBlockTxs**(`newBlocks`): `void`

Remove txs included in the latest blocks from the tx pool

#### Parameters

| Name | Type |
| :------ | :------ |
| `newBlocks` | `Block`[] |

#### Returns

`void`

#### Defined in

[TxPool.ts:385](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L385)

___

### start

▸ **start**(): `boolean`

Start tx processing

#### Returns

`boolean`

#### Defined in

[TxPool.ts:149](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L149)

___

### stop

▸ **stop**(): `boolean`

Stop pool execution

#### Returns

`boolean`

#### Defined in

[TxPool.ts:597](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L597)

___

### txGasPrice

▸ **txGasPrice**(`tx`): `GasPrice`

Returns the GasPrice object to provide information of the tx' gas prices

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tx` | `TypedTransaction` | Tx to use |

#### Returns

`GasPrice`

Gas price (both tip and max fee)

#### Defined in

[TxPool.ts:453](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L453)

___

### txsByPriceAndNonce

▸ **txsByPriceAndNonce**(`vm`, `«destructured»?`): `Promise`\<`TypedTransaction`[]\>

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

| Name | Type |
| :------ | :------ |
| `vm` | `TevmVm` |
| `«destructured»` | `Object` |
| › `allowedBlobs?` | `number` |
| › `baseFee?` | `bigint` |

#### Returns

`Promise`\<`TypedTransaction`[]\>

#### Defined in

[TxPool.ts:494](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L494)

___

### validate

▸ **validate**(`tx`, `isLocalTransaction?`): `Promise`\<`void`\>

Validates a transaction against the pool and other constraints

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `tx` | `TypedTransaction` | `undefined` | The tx to validate |
| `isLocalTransaction` | `boolean` | `false` | - |

#### Returns

`Promise`\<`void`\>

#### Defined in

[TxPool.ts:203](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L203)

___

### validateTxGasBump

▸ **validateTxGasBump**(`existingTx`, `addedTx`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `existingTx` | `TypedTransaction` |
| `addedTx` | `TypedTransaction` |

#### Returns

`void`

#### Defined in

[TxPool.ts:162](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L162)
