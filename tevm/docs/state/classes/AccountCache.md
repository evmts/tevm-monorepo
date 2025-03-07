[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / AccountCache

# Class: AccountCache

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/account.d.ts:14

## Extends

- `Cache`

## Constructors

### new AccountCache()

> **new AccountCache**(`opts`): [`AccountCache`](AccountCache.md)

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/account.d.ts:27

#### Parameters

##### opts

`CacheOpts`

#### Returns

[`AccountCache`](AccountCache.md)

#### Overrides

`Cache.constructor`

## Properties

### \_checkpoints

> **\_checkpoints**: `number`

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/cache.d.ts:4

#### Inherited from

`Cache._checkpoints`

***

### \_debug

> **\_debug**: `Debugger`

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/cache.d.ts:3

#### Inherited from

`Cache._debug`

***

### \_diffCache

> **\_diffCache**: `Map`\<`string`, `undefined` \| `AccountCacheElement`\>[]

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/account.d.ts:26

Diff cache collecting the state of the cache
at the beginning of checkpoint height
(respectively: before a first modification)

If the whole cache element is undefined (in contrast
to the account), the element didn't exist in the cache
before.

***

### \_lruCache

> **\_lruCache**: `undefined` \| `LRUCache`\<`string`, `AccountCacheElement`, `unknown`\>

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/account.d.ts:15

***

### \_orderedMapCache

> **\_orderedMapCache**: `undefined` \| `OrderedMap`\<`string`, `AccountCacheElement`\>

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/account.d.ts:16

***

### \_stats

> **\_stats**: `object`

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/cache.d.ts:5

#### dels

> **dels**: `number`

#### hits

> **hits**: `number`

#### reads

> **reads**: `number`

#### size

> **size**: `number`

#### writes

> **writes**: `number`

#### Inherited from

`Cache._stats`

## Methods

### \_saveCachePreState()

> **\_saveCachePreState**(`cacheKeyHex`): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/account.d.ts:28

#### Parameters

##### cacheKeyHex

`string`

#### Returns

`void`

***

### checkpoint()

> **checkpoint**(): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/account.d.ts:62

Marks current state of cache as checkpoint, which can
later on be reverted or committed.

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/account.d.ts:82

Clears cache.

#### Returns

`void`

***

### commit()

> **commit**(): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/account.d.ts:57

Commits to current state of cache (no effect on trie).

#### Returns

`void`

***

### del()

> **del**(`address`): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/account.d.ts:44

Marks address as deleted in cache.

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Address

#### Returns

`void`

***

### flush()

> **flush**(): \[`string`, `AccountCacheElement`\][]

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/account.d.ts:49

Flushes cache by returning accounts that have been modified
or deleted and resetting the diff cache (at checkpoint height).

#### Returns

\[`string`, `AccountCacheElement`\][]

***

### get()

> **get**(`address`): `undefined` \| `AccountCacheElement`

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/account.d.ts:39

Returns the queried account or undefined if account doesn't exist

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Address of account

#### Returns

`undefined` \| `AccountCacheElement`

***

### put()

> **put**(`address`, `account`, `couldBeParitalAccount`?): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/account.d.ts:34

Puts account to cache under its address.

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Address of account

##### account

Account or undefined if account doesn't exist in the trie

`undefined` | [`EthjsAccount`](../../utils/classes/EthjsAccount.md)

##### couldBeParitalAccount?

`boolean`

#### Returns

`void`

***

### revert()

> **revert**(): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/account.d.ts:53

Revert changes to cache last checkpoint (no effect on trie).

#### Returns

`void`

***

### size()

> **size**(): `number`

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/account.d.ts:67

Returns the size of the cache

#### Returns

`number`

***

### stats()

> **stats**(`reset`?): `object`

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/account.d.ts:72

Returns a dict with cache stats

#### Parameters

##### reset?

`boolean`

#### Returns

`object`

##### dels

> **dels**: `number`

##### hits

> **hits**: `number`

##### reads

> **reads**: `number`

##### size

> **size**: `number`

##### writes

> **writes**: `number`
