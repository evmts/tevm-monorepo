[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / StorageCache

# Class: StorageCache

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/storage.d.ts:13

## Extends

- `Cache`

## Constructors

### new StorageCache()

> **new StorageCache**(`opts`): [`StorageCache`](StorageCache.md)

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/storage.d.ts:26

#### Parameters

##### opts

`CacheOpts`

#### Returns

[`StorageCache`](StorageCache.md)

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

> **\_diffCache**: `Map`\<`string`, `DiffStorageCacheMap`\>[]

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/storage.d.ts:25

Diff cache collecting the state of the cache
at the beginning of checkpoint height
(respectively: before a first modification)

If the whole cache element is undefined (in contrast
to the account), the element didn't exist in the cache
before.

***

### \_lruCache

> **\_lruCache**: `undefined` \| `LRUCache`\<`string`, `StorageCacheMap`, `unknown`\>

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/storage.d.ts:14

***

### \_orderedMapCache

> **\_orderedMapCache**: `undefined` \| `OrderedMap`\<`string`, `StorageCacheMap`\>

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/storage.d.ts:15

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

> **\_saveCachePreState**(`addressHex`, `keyHex`): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/storage.d.ts:27

#### Parameters

##### addressHex

`string`

##### keyHex

`string`

#### Returns

`void`

***

### checkpoint()

> **checkpoint**(): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/storage.d.ts:72

Marks current state of cache as checkpoint, which can
later on be reverted or committed.

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/storage.d.ts:92

Clears cache.

#### Returns

`void`

***

### clearContractStorage()

> **clearContractStorage**(`address`): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/storage.d.ts:54

Deletes all storage slots for address from the cache

#### Parameters

##### address

`Address`

#### Returns

`void`

***

### commit()

> **commit**(): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/storage.d.ts:67

Commits to current state of cache (no effect on trie).

#### Returns

`void`

***

### del()

> **del**(`address`, `key`): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/storage.d.ts:49

Marks storage key for address as deleted in cache.

#### Parameters

##### address

`Address`

Address

##### key

`Uint8Array`

Storage key

#### Returns

`void`

***

### dump()

> **dump**(`address`): `undefined` \| `StorageCacheMap`

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/storage.d.ts:98

Dumps the RLP-encoded storage values for an `account` specified by `address`.

#### Parameters

##### address

`Address`

The address of the `account` to return storage for

#### Returns

`undefined` \| `StorageCacheMap`

- The storage values for the `account` or undefined if the `account` is not in the cache

***

### flush()

> **flush**(): \[`string`, `string`, `undefined` \| `Uint8Array`\<`ArrayBufferLike`\>\][]

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/storage.d.ts:59

Flushes cache by returning storage slots that have been modified
or deleted and resetting the diff cache (at checkpoint height).

#### Returns

\[`string`, `string`, `undefined` \| `Uint8Array`\<`ArrayBufferLike`\>\][]

***

### get()

> **get**(`address`, `key`): `undefined` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/storage.d.ts:43

Returns the queried slot as the RLP encoded storage value
hexToBytes('0x80'): slot is known to be empty
undefined: slot is not in cache

#### Parameters

##### address

`Address`

Address of account

##### key

`Uint8Array`

Storage key

#### Returns

`undefined` \| `Uint8Array`\<`ArrayBufferLike`\>

Storage value or undefined

***

### put()

> **put**(`address`, `key`, `value`): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/storage.d.ts:34

Puts storage value to cache under address_key cache key.

#### Parameters

##### address

`Address`

Account address

##### key

`Uint8Array`

Storage key

##### value

`Uint8Array`

#### Returns

`void`

***

### revert()

> **revert**(): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/storage.d.ts:63

Revert changes to cache last checkpoint (no effect on trie).

#### Returns

`void`

***

### size()

> **size**(): `number`

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/storage.d.ts:77

Returns the size of the cache

#### Returns

`number`

***

### stats()

> **stats**(`reset`?): `object`

Defined in: node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/storage.d.ts:82

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
