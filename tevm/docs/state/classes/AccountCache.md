[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / AccountCache

# Class: AccountCache

## Extends

- `Cache`

## Constructors

### Constructor

> **new AccountCache**(`opts`): `AccountCache`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | `CacheOpts` |

#### Returns

`AccountCache`

#### Overrides

`Cache.constructor`

## Properties

| Property | Modifier | Type | Default value | Inherited from |
| ------ | ------ | ------ | ------ | ------ |
| <a id="_checkpoints"></a> `_checkpoints` | `public` | `number` | `undefined` | `Cache._checkpoints` |
| <a id="_diffcache"></a> `_diffCache` | `public` | `Map`\<`string`, `AccountCacheElement` \| `undefined`\>[] | `undefined` | - |
| <a id="_lrucache"></a> `_lruCache` | `public` | `SimpleLRUCache`\<`string`, `AccountCacheElement`\> \| `undefined` | `undefined` | - |
| <a id="_orderedmapcache"></a> `_orderedMapCache` | `public` | `SimpleOrderedMap`\<`string`, `AccountCacheElement`\> \| `undefined` | `undefined` | - |
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

> **\_saveCachePreState**(`cacheKeyHex`): `void`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `cacheKeyHex` | `string` |

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

### commit()

> **commit**(): `void`

#### Returns

`void`

***

### del()

> **del**(`address`): `void`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | [`EthjsAddress`](../../utils/classes/EthjsAddress.md) |

#### Returns

`void`

***

### flush()

> **flush**(): \[`string`, `AccountCacheElement`\][]

#### Returns

\[`string`, `AccountCacheElement`\][]

***

### get()

> **get**(`address`): `AccountCacheElement` \| `undefined`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | [`EthjsAddress`](../../utils/classes/EthjsAddress.md) |

#### Returns

`AccountCacheElement` \| `undefined`

***

### put()

> **put**(`address`, `account`, `couldBePartialAccount?`): `void`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | [`EthjsAddress`](../../utils/classes/EthjsAddress.md) |
| `account` | [`EthjsAccount`](../../utils/classes/EthjsAccount.md) \| `undefined` |
| `couldBePartialAccount?` | `boolean` |

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
