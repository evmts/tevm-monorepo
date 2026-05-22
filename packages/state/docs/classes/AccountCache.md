[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / AccountCache

# Class: AccountCache

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:71

## Extends

- `Cache`

## Constructors

### Constructor

> **new AccountCache**(`opts`): `AccountCache`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:75

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | `CacheOpts` |

#### Returns

`AccountCache`

#### Overrides

`Cache.constructor`

## Properties

| Property | Modifier | Type | Default value | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="_checkpoints"></a> `_checkpoints` | `public` | `number` | `undefined` | `Cache._checkpoints` | zevm/npm/zevm/dist/statemanager.d.ts:66 |
| <a id="_diffcache"></a> `_diffCache` | `public` | `Map`\<`string`, `AccountCacheElement` \| `undefined`\>[] | `undefined` | - | zevm/npm/zevm/dist/statemanager.d.ts:74 |
| <a id="_lrucache"></a> `_lruCache` | `public` | `SimpleLRUCache`\<`string`, `AccountCacheElement`\> \| `undefined` | `undefined` | - | zevm/npm/zevm/dist/statemanager.d.ts:72 |
| <a id="_orderedmapcache"></a> `_orderedMapCache` | `public` | `SimpleOrderedMap`\<`string`, `AccountCacheElement`\> \| `undefined` | `undefined` | - | zevm/npm/zevm/dist/statemanager.d.ts:73 |
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

> **\_saveCachePreState**(`cacheKeyHex`): `void`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:76

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `cacheKeyHex` | `string` |

#### Returns

`void`

***

### checkpoint()

> **checkpoint**(): `void`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:83

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:86

#### Returns

`void`

***

### commit()

> **commit**(): `void`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:82

#### Returns

`void`

***

### del()

> **del**(`address`): `void`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:79

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | `Address` |

#### Returns

`void`

***

### flush()

> **flush**(): \[`string`, `AccountCacheElement`\][]

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:80

#### Returns

\[`string`, `AccountCacheElement`\][]

***

### get()

> **get**(`address`): `AccountCacheElement` \| `undefined`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:78

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | `Address` |

#### Returns

`AccountCacheElement` \| `undefined`

***

### put()

> **put**(`address`, `account`, `couldBePartialAccount?`): `void`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:77

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | `Address` |
| `account` | `Account` \| `undefined` |
| `couldBePartialAccount?` | `boolean` |

#### Returns

`void`

***

### revert()

> **revert**(): `void`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:81

#### Returns

`void`

***

### size()

> **size**(): `number`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:84

#### Returns

`number`

***

### stats()

> **stats**(`reset?`): `CacheStats`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:85

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `reset?` | `boolean` |

#### Returns

`CacheStats`
