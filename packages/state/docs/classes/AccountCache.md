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

##### opts

`CacheOpts`

#### Returns

`AccountCache`

#### Overrides

`Cache.constructor`

## Properties

### \_checkpoints

> **\_checkpoints**: `number`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:66

#### Inherited from

`Cache._checkpoints`

***

### \_diffCache

> **\_diffCache**: `Map`\<`string`, `AccountCacheElement` \| `undefined`\>[]

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:74

***

### \_lruCache

> **\_lruCache**: `SimpleLRUCache`\<`string`, `AccountCacheElement`\> \| `undefined`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:72

***

### \_orderedMapCache

> **\_orderedMapCache**: `SimpleOrderedMap`\<`string`, `AccountCacheElement`\> \| `undefined`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:73

***

### \_stats

> **\_stats**: `CacheStats`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:67

#### Inherited from

`Cache._stats`

***

### DEBUG

> `protected` `readonly` **DEBUG**: `false` = `false`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:68

#### Inherited from

`Cache.DEBUG`

## Methods

### \_debug()

> **\_debug**(`_message`): `void`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:69

#### Parameters

##### \_message

`string`

#### Returns

`void`

#### Inherited from

`Cache._debug`

***

### \_saveCachePreState()

> **\_saveCachePreState**(`cacheKeyHex`): `void`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:76

#### Parameters

##### cacheKeyHex

`string`

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

##### address

`Address`

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

##### address

`Address`

#### Returns

`AccountCacheElement` \| `undefined`

***

### put()

> **put**(`address`, `account`, `couldBePartialAccount?`): `void`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:77

#### Parameters

##### address

`Address`

##### account

`Account` \| `undefined`

##### couldBePartialAccount?

`boolean`

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

##### reset?

`boolean`

#### Returns

`CacheStats`
