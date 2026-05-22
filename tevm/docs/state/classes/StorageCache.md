[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / StorageCache

# Class: StorageCache

## Extends

- `Cache`

## Constructors

### Constructor

> **new StorageCache**(`opts`): `StorageCache`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | `CacheOpts` |

#### Returns

`StorageCache`

#### Overrides

`Cache.constructor`

## Properties

| Property | Modifier | Type | Default value | Inherited from |
| ------ | ------ | ------ | ------ | ------ |
| <a id="_checkpoints"></a> `_checkpoints` | `public` | `number` | `undefined` | `Cache._checkpoints` |
| <a id="_diffcache"></a> `_diffCache` | `public` | `Map`\<`string`, `DiffStorageCacheMap`\>[] | `undefined` | - |
| <a id="_lrucache"></a> `_lruCache` | `public` | `SimpleLRUCache`\<`string`, `StorageCacheMap`\> \| `undefined` | `undefined` | - |
| <a id="_orderedmapcache"></a> `_orderedMapCache` | `public` | `SimpleOrderedMap`\<`string`, `StorageCacheMap`\> \| `undefined` | `undefined` | - |
| <a id="_stats"></a> `_stats` | `public` | `CacheStats` | `undefined` | `Cache._stats` |
| <a id="debug"></a> `DEBUG` | `readonly` | `false` | `false` | `Cache.DEBUG` |

## Methods

### \_debug()

> **\_debug**(`_message`): `void`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `_message` | `string` |

#### Returns

`void`

#### Inherited from

`Cache._debug`

***

### \_saveCachePreState()

> **\_saveCachePreState**(`addressHex`, `keyHex`): `void`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `addressHex` | `string` |
| `keyHex` | `string` |

#### Returns

`void`

***

### checkpoint()

> **checkpoint**(): `void`

#### Returns

`void`

***

### clear()

> **clear**(): `void`

#### Returns

`void`

***

### clearStorage()

> **clearStorage**(`address`): `void`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | [`EthjsAddress`](../../utils/classes/EthjsAddress.md) |

#### Returns

`void`

***

### commit()

> **commit**(): `void`

#### Returns

`void`

***

### del()

> **del**(`address`, `key`): `void`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | [`EthjsAddress`](../../utils/classes/EthjsAddress.md) |
| `key` | `Uint8Array` |

#### Returns

`void`

***

### dump()

> **dump**(`address`): `StorageCacheMap` \| `undefined`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | [`EthjsAddress`](../../utils/classes/EthjsAddress.md) |

#### Returns

`StorageCacheMap` \| `undefined`

***

### flush()

> **flush**(): \[`string`, `string`, `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`\][]

#### Returns

\[`string`, `string`, `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`\][]

***

### get()

> **get**(`address`, `key`): `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | [`EthjsAddress`](../../utils/classes/EthjsAddress.md) |
| `key` | `Uint8Array` |

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

***

### put()

> **put**(`address`, `key`, `value`): `void`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | [`EthjsAddress`](../../utils/classes/EthjsAddress.md) |
| `key` | `Uint8Array` |
| `value` | `Uint8Array` |

#### Returns

`void`

***

### revert()

> **revert**(): `void`

#### Returns

`void`

***

### size()

> **size**(): `number`

#### Returns

`number`

***

### stats()

> **stats**(`reset?`): `CacheStats`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `reset?` | `boolean` |

#### Returns

`CacheStats`
