[**@tevm/txpool**](../README.md)

***

[@tevm/txpool](../globals.md) / TxPool

# Class: TxPool

Defined in: [tevm-monorepo/packages/txpool/src/TxPool.ts:40](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L40)

Tevm txpool facade.

ZEVM's pool handles the storage and nonce ordering, while this facade broadens
fee classification to all fee-market-shaped transactions, including EIP-7702.

## Extends

- `TxPool`

## Constructors

### Constructor

> **new TxPool**(...`args`): `TxPool`

Defined in: [tevm-monorepo/packages/txpool/src/TxPool.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L41)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | \[[`TxPoolOptions`](../interfaces/TxPoolOptions.md)\] |

#### Returns

`TxPool`

#### Overrides

`ZevmTxPool.constructor`

## Properties

| Property | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="blocks_before_target_height_activation"></a> `BLOCKS_BEFORE_TARGET_HEIGHT_ACTIVATION` | `number` | `ZevmTxPool.BLOCKS_BEFORE_TARGET_HEIGHT_ACTIVATION` | zevm/npm/zevm/dist/txpool.d.ts:57 |
| <a id="handled_cleanup_time_limit"></a> `HANDLED_CLEANUP_TIME_LIMIT` | `number` | `ZevmTxPool.HANDLED_CLEANUP_TIME_LIMIT` | zevm/npm/zevm/dist/txpool.d.ts:59 |
| <a id="pool"></a> `pool` | `Map`\<`string`, [`TxPoolObject`](../type-aliases/TxPoolObject.md)[]\> | `ZevmTxPool.pool` | zevm/npm/zevm/dist/txpool.d.ts:51 |
| <a id="pooled_storage_time_limit"></a> `POOLED_STORAGE_TIME_LIMIT` | `number` | `ZevmTxPool.POOLED_STORAGE_TIME_LIMIT` | zevm/npm/zevm/dist/txpool.d.ts:58 |
| <a id="running"></a> `running` | `boolean` | `ZevmTxPool.running` | zevm/npm/zevm/dist/txpool.d.ts:48 |
| <a id="txsbyhash"></a> `txsByHash` | `Map`\<`string`, [`TxPoolTransaction`](../type-aliases/TxPoolTransaction.md)\> | `ZevmTxPool.txsByHash` | zevm/npm/zevm/dist/txpool.d.ts:53 |
| <a id="txsbynonce"></a> `txsByNonce` | `Map`\<`string`, `Map`\<`bigint`, [`TxPoolTransaction`](../type-aliases/TxPoolTransaction.md)\>\> | `ZevmTxPool.txsByNonce` | zevm/npm/zevm/dist/txpool.d.ts:54 |
| <a id="txsinnonceorder"></a> `txsInNonceOrder` | `Map`\<`string`, [`TxPoolTransaction`](../type-aliases/TxPoolTransaction.md)[]\> | `ZevmTxPool.txsInNonceOrder` | zevm/npm/zevm/dist/txpool.d.ts:52 |
| <a id="txsinpool"></a> `txsInPool` | `number` | `ZevmTxPool.txsInPool` | zevm/npm/zevm/dist/txpool.d.ts:55 |

## Methods

### \_logPoolStats()

> **\_logPoolStats**(): `void`

Defined in: zevm/npm/zevm/dist/txpool.d.ts:91

#### Returns

`void`

#### Inherited from

`ZevmTxPool._logPoolStats`

***

### add()

> **add**(`tx`, `requireSignature?`, `skipBalance?`): `Promise`\<`TxPoolAddResult`\>

Defined in: zevm/npm/zevm/dist/txpool.d.ts:67

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `tx` | [`TxPoolTransaction`](../type-aliases/TxPoolTransaction.md) |
| `requireSignature?` | `boolean` |
| `skipBalance?` | `boolean` |

#### Returns

`Promise`\<`TxPoolAddResult`\>

#### Inherited from

`ZevmTxPool.add`

***

### addUnverified()

> **addUnverified**(`tx`): `Promise`\<`TxPoolAddResult`\>

Defined in: zevm/npm/zevm/dist/txpool.d.ts:66

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `tx` | [`TxPoolTransaction`](../type-aliases/TxPoolTransaction.md) |

#### Returns

`Promise`\<`TxPoolAddResult`\>

#### Inherited from

`ZevmTxPool.addUnverified`

***

### cleanup()

> **cleanup**(): `void`

Defined in: [tevm-monorepo/packages/txpool/src/TxPool.ts:84](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L84)

#### Returns

`void`

#### Overrides

`ZevmTxPool.cleanup`

***

### clear()

> **clear**(): `Promise`\<`void`\>

Defined in: zevm/npm/zevm/dist/txpool.d.ts:89

#### Returns

`Promise`\<`void`\>

#### Inherited from

`ZevmTxPool.clear`

***

### close()

> **close**(): `void`

Defined in: zevm/npm/zevm/dist/txpool.d.ts:88

#### Returns

`void`

#### Inherited from

`ZevmTxPool.close`

***

### deepCopy()

> **deepCopy**(`opt`): `TxPool`

Defined in: zevm/npm/zevm/dist/txpool.d.ts:61

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `opt` | [`TxPoolOptions`](../interfaces/TxPoolOptions.md) |

#### Returns

`TxPool`

#### Inherited from

`ZevmTxPool.deepCopy`

***

### getByHash()

#### Call Signature

> **getByHash**(`txHashes`): [`TxPoolTransaction`](../type-aliases/TxPoolTransaction.md) \| `null`

Defined in: zevm/npm/zevm/dist/txpool.d.ts:68

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `txHashes` | `string` |

##### Returns

[`TxPoolTransaction`](../type-aliases/TxPoolTransaction.md) \| `null`

##### Inherited from

`ZevmTxPool.getByHash`

#### Call Signature

> **getByHash**(`txHashes`): [`TxPoolTransaction`](../type-aliases/TxPoolTransaction.md)[]

Defined in: zevm/npm/zevm/dist/txpool.d.ts:69

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `txHashes` | readonly `Uint8Array`\<`ArrayBufferLike`\>[] |

##### Returns

[`TxPoolTransaction`](../type-aliases/TxPoolTransaction.md)[]

##### Inherited from

`ZevmTxPool.getByHash`

***

### getBySenderAddress()

> **getBySenderAddress**(`address`): `Promise`\<[`TxPoolObject`](../type-aliases/TxPoolObject.md)[]\>

Defined in: zevm/npm/zevm/dist/txpool.d.ts:75

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | `Address` |

#### Returns

`Promise`\<[`TxPoolObject`](../type-aliases/TxPoolObject.md)[]\>

#### Inherited from

`ZevmTxPool.getBySenderAddress`

***

### getPendingTransactions()

> **getPendingTransactions**(): `Promise`\<[`TxPoolTransaction`](../type-aliases/TxPoolTransaction.md)[]\>

Defined in: zevm/npm/zevm/dist/txpool.d.ts:76

#### Returns

`Promise`\<[`TxPoolTransaction`](../type-aliases/TxPoolTransaction.md)[]\>

#### Inherited from

`ZevmTxPool.getPendingTransactions`

***

### getTransactionStatus()

> **getTransactionStatus**(`txHash`): `Promise`\<`"unknown"` \| `"pending"` \| `"mined"`\>

Defined in: zevm/npm/zevm/dist/txpool.d.ts:77

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `txHash` | `string` |

#### Returns

`Promise`\<`"unknown"` \| `"pending"` \| `"mined"`\>

#### Inherited from

`ZevmTxPool.getTransactionStatus`

***

### logStats()

> **logStats**(): `void`

Defined in: zevm/npm/zevm/dist/txpool.d.ts:90

#### Returns

`void`

#### Inherited from

`ZevmTxPool.logStats`

***

### on()

> **on**(`event`, `callback`): () => `void`

Defined in: zevm/npm/zevm/dist/txpool.d.ts:79

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `"txadded"` \| `"txremoved"` |
| `callback` | (`hash`) => `void` |

#### Returns

() => `void`

#### Inherited from

`ZevmTxPool.on`

***

### onBlockAdded()

> **onBlockAdded**(`block`): `Promise`\<`void`\>

Defined in: zevm/npm/zevm/dist/txpool.d.ts:81

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `block` | [`TxPoolBlock`](../type-aliases/TxPoolBlock.md) |

#### Returns

`Promise`\<`void`\>

#### Inherited from

`ZevmTxPool.onBlockAdded`

***

### onChainReorganization()

> **onChainReorganization**(`removedBlocks`, `addedBlocks`): `Promise`\<`void`\>

Defined in: zevm/npm/zevm/dist/txpool.d.ts:82

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `removedBlocks` | [`TxPoolBlock`](../type-aliases/TxPoolBlock.md)[] |
| `addedBlocks` | [`TxPoolBlock`](../type-aliases/TxPoolBlock.md)[] |

#### Returns

`Promise`\<`void`\>

#### Inherited from

`ZevmTxPool.onChainReorganization`

***

### open()

> **open**(): `boolean`

Defined in: zevm/npm/zevm/dist/txpool.d.ts:62

#### Returns

`boolean`

#### Inherited from

`ZevmTxPool.open`

***

### removeByHash()

> **removeByHash**(`txHash`): `void`

Defined in: zevm/npm/zevm/dist/txpool.d.ts:70

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `txHash` | `string` |

#### Returns

`void`

#### Inherited from

`ZevmTxPool.removeByHash`

***

### removeNewBlockTxs()

> **removeNewBlockTxs**(`newBlocks`): `void`

Defined in: zevm/npm/zevm/dist/txpool.d.ts:71

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `newBlocks` | [`TxPoolBlock`](../type-aliases/TxPoolBlock.md)[] |

#### Returns

`void`

#### Inherited from

`ZevmTxPool.removeNewBlockTxs`

***

### start()

> **start**(): `boolean`

Defined in: zevm/npm/zevm/dist/txpool.d.ts:63

#### Returns

`boolean`

#### Inherited from

`ZevmTxPool.start`

***

### stop()

> **stop**(): `boolean`

Defined in: zevm/npm/zevm/dist/txpool.d.ts:87

#### Returns

`boolean`

#### Inherited from

`ZevmTxPool.stop`

***

### txsByPriceAndNonce()

> **txsByPriceAndNonce**(`__namedParameters?`): `Promise`\<[`TxPoolTransaction`](../type-aliases/TxPoolTransaction.md)[]\>

Defined in: zevm/npm/zevm/dist/txpool.d.ts:83

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters?` | \{ `allowedBlobs?`: `number`; `baseFee?`: `bigint`; \} |
| `__namedParameters.allowedBlobs?` | `number` |
| `__namedParameters.baseFee?` | `bigint` |

#### Returns

`Promise`\<[`TxPoolTransaction`](../type-aliases/TxPoolTransaction.md)[]\>

#### Inherited from

`ZevmTxPool.txsByPriceAndNonce`
