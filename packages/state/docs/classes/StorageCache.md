[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / StorageCache

# Class: StorageCache

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:88

## Extends

- `Cache`

## Constructors

### Constructor

> **new StorageCache**(`opts`): `StorageCache`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:92

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | `CacheOpts` |

#### Returns

`StorageCache`

#### Overrides

`Cache.constructor`

## Properties

| Property | Modifier | Type | Default value | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="_checkpoints"></a> `_checkpoints` | `public` | `number` | `undefined` | `Cache._checkpoints` | zevm/npm/zevm/dist/statemanager.d.ts:66 |
| <a id="_diffcache"></a> `_diffCache` | `public` | `Map`\<`string`, `DiffStorageCacheMap`\>[] | `undefined` | - | zevm/npm/zevm/dist/statemanager.d.ts:91 |
| <a id="_lrucache"></a> `_lruCache` | `public` | `SimpleLRUCache`\<`string`, `StorageCacheMap`\> \| `undefined` | `undefined` | - | zevm/npm/zevm/dist/statemanager.d.ts:89 |
| <a id="_orderedmapcache"></a> `_orderedMapCache` | `public` | `SimpleOrderedMap`\<`string`, `StorageCacheMap`\> \| `undefined` | `undefined` | - | zevm/npm/zevm/dist/statemanager.d.ts:90 |
| <a id="_stats"></a> `_stats` | `public` | `CacheStats` | `undefined` | `Cache._stats` | zevm/npm/zevm/dist/statemanager.d.ts:67 |
| <a id="debug"></a> `DEBUG` | `readonly` | `false` | `false` | `Cache.DEBUG` | zevm/npm/zevm/dist/statemanager.d.ts:68 |

## Methods

### \_debug()

> **\_debug**(`_message`): `void`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:69

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

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:93

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

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:101

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:104

#### Returns

`void`

***

### clearStorage()

> **clearStorage**(`address`): `void`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:97

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | `Address` |

#### Returns

`void`

***

### commit()

> **commit**(): `void`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:100

#### Returns

`void`

***

### del()

> **del**(`address`, `key`): `void`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:96

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | `Address` |
| `key` | `Uint8Array` |

#### Returns

`void`

***

### dump()

> **dump**(`address`): `StorageCacheMap` \| `undefined`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:105

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | `Address` |

#### Returns

`StorageCacheMap` \| `undefined`

***

### flush()

> **flush**(): \[`string`, `string`, `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`\][]

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:98

#### Returns

\[`string`, `string`, `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`\][]

***

### get()

> **get**(`address`, `key`): `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:95

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | `Address` |
| `key` | `Uint8Array` |

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

***

### put()

> **put**(`address`, `key`, `value`): `void`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:94

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | `Address` |
| `key` | `Uint8Array` |
| `value` | `Uint8Array` |

#### Returns

`void`

***

### revert()

> **revert**(): `void`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:99

#### Returns

`void`

***

### size()

> **size**(): `number`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:102

#### Returns

`number`

***

### stats()

> **stats**(`reset?`): `CacheStats`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:103

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `reset?` | `boolean` |

#### Returns

`CacheStats`
