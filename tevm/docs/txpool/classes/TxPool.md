[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [txpool](../README.md) / TxPool

# Class: TxPool

Tevm txpool facade.

ZEVM's pool handles the storage and nonce ordering, while this facade broadens
fee classification to all fee-market-shaped transactions, including EIP-7702.

## Extends

- `TxPool`

## Constructors

### Constructor

> **new TxPool**(...`args`): `TxPool`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | \[[`TxPoolOptions`](../interfaces/TxPoolOptions.md)\] |

#### Returns

`TxPool`

#### Overrides

`ZevmTxPool.constructor`

## Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| <a id="blocks_before_target_height_activation"></a> `BLOCKS_BEFORE_TARGET_HEIGHT_ACTIVATION` | `number` | `ZevmTxPool.BLOCKS_BEFORE_TARGET_HEIGHT_ACTIVATION` |
| <a id="handled_cleanup_time_limit"></a> `HANDLED_CLEANUP_TIME_LIMIT` | `number` | `ZevmTxPool.HANDLED_CLEANUP_TIME_LIMIT` |
| <a id="pool"></a> `pool` | `Map`\<`string`, [`TxPoolObject`](../type-aliases/TxPoolObject.md)[]\> | `ZevmTxPool.pool` |
| <a id="pooled_storage_time_limit"></a> `POOLED_STORAGE_TIME_LIMIT` | `number` | `ZevmTxPool.POOLED_STORAGE_TIME_LIMIT` |
| <a id="running"></a> `running` | `boolean` | `ZevmTxPool.running` |
| <a id="txsbyhash"></a> `txsByHash` | `Map`\<`string`, [`TxPoolTransaction`](../type-aliases/TxPoolTransaction.md)\> | `ZevmTxPool.txsByHash` |
| <a id="txsbynonce"></a> `txsByNonce` | `Map`\<`string`, `Map`\<`bigint`, [`TxPoolTransaction`](../type-aliases/TxPoolTransaction.md)\>\> | `ZevmTxPool.txsByNonce` |
| <a id="txsinnonceorder"></a> `txsInNonceOrder` | `Map`\<`string`, [`TxPoolTransaction`](../type-aliases/TxPoolTransaction.md)[]\> | `ZevmTxPool.txsInNonceOrder` |
| <a id="txsinpool"></a> `txsInPool` | `number` | `ZevmTxPool.txsInPool` |

## Methods

### \_logPoolStats()

> **\_logPoolStats**(): `void`

#### Returns

`void`

#### Inherited from

`ZevmTxPool._logPoolStats`

***

### add()

> **add**(`tx`, `requireSignature?`, `skipBalance?`): `Promise`\<`TxPoolAddResult`\>

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

#### Returns

`void`

#### Overrides

`ZevmTxPool.cleanup`

***

### clear()

> **clear**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`ZevmTxPool.clear`

***

### close()

> **close**(): `void`

#### Returns

`void`

#### Inherited from

`ZevmTxPool.close`

***

### deepCopy()

> **deepCopy**(`opt`): `TxPool`

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

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | [`EthjsAddress`](../../utils/classes/EthjsAddress.md) |

#### Returns

`Promise`\<[`TxPoolObject`](../type-aliases/TxPoolObject.md)[]\>

#### Inherited from

`ZevmTxPool.getBySenderAddress`

***

### getPendingTransactions()

> **getPendingTransactions**(): `Promise`\<[`TxPoolTransaction`](../type-aliases/TxPoolTransaction.md)[]\>

#### Returns

`Promise`\<[`TxPoolTransaction`](../type-aliases/TxPoolTransaction.md)[]\>

#### Inherited from

`ZevmTxPool.getPendingTransactions`

***

### getTransactionStatus()

> **getTransactionStatus**(`txHash`): `Promise`\<`"pending"` \| `"mined"` \| `"unknown"`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `txHash` | `string` |

#### Returns

`Promise`\<`"pending"` \| `"mined"` \| `"unknown"`\>

#### Inherited from

`ZevmTxPool.getTransactionStatus`

***

### logStats()

> **logStats**(): `void`

#### Returns

`void`

#### Inherited from

`ZevmTxPool.logStats`

***

### on()

> **on**(`event`, `callback`): () => `void`

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

#### Returns

`boolean`

#### Inherited from

`ZevmTxPool.open`

***

### removeByHash()

> **removeByHash**(`txHash`): `void`

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

#### Returns

`boolean`

#### Inherited from

`ZevmTxPool.start`

***

### stop()

> **stop**(): `boolean`

#### Returns

`boolean`

#### Inherited from

`ZevmTxPool.stop`

***

### txsByPriceAndNonce()

> **txsByPriceAndNonce**(`__namedParameters?`): `Promise`\<[`TxPoolTransaction`](../type-aliases/TxPoolTransaction.md)[]\>

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
