[**@tevm/state**](../README.md) • **Docs**

***

[@tevm/state](../globals.md) / StorageCache

# Class: StorageCache

## Extends

- `Cache`

## Constructors

### new StorageCache()

> **new StorageCache**(`opts`): [`StorageCache`](StorageCache.md)

#### Parameters

• **opts**: `CacheOpts`

#### Returns

[`StorageCache`](StorageCache.md)

#### Overrides

`Cache.constructor`

#### Defined in

node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/storage.d.ts:26

## Properties

### \_checkpoints

> **\_checkpoints**: `number`

#### Inherited from

`Cache._checkpoints`

#### Defined in

node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/cache.d.ts:4

***

### \_debug

> **\_debug**: `Debugger`

#### Inherited from

`Cache._debug`

#### Defined in

node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/cache.d.ts:3

***

### \_diffCache

> **\_diffCache**: `Map`\<`string`, `DiffStorageCacheMap`\>[]

Diff cache collecting the state of the cache
at the beginning of checkpoint height
(respectively: before a first modification)

If the whole cache element is undefined (in contrast
to the account), the element didn't exist in the cache
before.

#### Defined in

node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/storage.d.ts:25

***

### \_lruCache

> **\_lruCache**: `undefined` \| `LRUCache`\<`string`, `StorageCacheMap`, `unknown`\>

#### Defined in

node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/storage.d.ts:14

***

### \_orderedMapCache

> **\_orderedMapCache**: `undefined` \| `OrderedMap`\<`string`, `StorageCacheMap`\>

#### Defined in

node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/storage.d.ts:15

***

### \_stats

> **\_stats**: `object`

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

#### Defined in

node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/cache.d.ts:5

## Methods

### \_saveCachePreState()

> **\_saveCachePreState**(`addressHex`, `keyHex`): `void`

#### Parameters

• **addressHex**: `string`

• **keyHex**: `string`

#### Returns

`void`

#### Defined in

node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/storage.d.ts:27

***

### checkpoint()

> **checkpoint**(): `void`

Marks current state of cache as checkpoint, which can
later on be reverted or committed.

#### Returns

`void`

#### Defined in

node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/storage.d.ts:72

***

### clear()

> **clear**(): `void`

Clears cache.

#### Returns

`void`

#### Defined in

node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/storage.d.ts:92

***

### clearContractStorage()

> **clearContractStorage**(`address`): `void`

Deletes all storage slots for address from the cache

#### Parameters

• **address**: `Address`

#### Returns

`void`

#### Defined in

node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/storage.d.ts:54

***

### commit()

> **commit**(): `void`

Commits to current state of cache (no effect on trie).

#### Returns

`void`

#### Defined in

node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/storage.d.ts:67

***

### del()

> **del**(`address`, `key`): `void`

Marks storage key for address as deleted in cache.

#### Parameters

• **address**: `Address`

Address

• **key**: `Uint8Array`

Storage key

#### Returns

`void`

#### Defined in

node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/storage.d.ts:49

***

### dump()

> **dump**(`address`): `undefined` \| `StorageCacheMap`

Dumps the RLP-encoded storage values for an `account` specified by `address`.

#### Parameters

• **address**: `Address`

The address of the `account` to return storage for

#### Returns

`undefined` \| `StorageCacheMap`

- The storage values for the `account` or undefined if the `account` is not in the cache

#### Defined in

node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/storage.d.ts:98

***

### flush()

> **flush**(): [`string`, `string`, `undefined` \| `Uint8Array`][]

Flushes cache by returning storage slots that have been modified
or deleted and resetting the diff cache (at checkpoint height).

#### Returns

[`string`, `string`, `undefined` \| `Uint8Array`][]

#### Defined in

node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/storage.d.ts:59

***

### get()

> **get**(`address`, `key`): `undefined` \| `Uint8Array`

Returns the queried slot as the RLP encoded storage value
hexToBytes('0x80'): slot is known to be empty
undefined: slot is not in cache

#### Parameters

• **address**: `Address`

Address of account

• **key**: `Uint8Array`

Storage key

#### Returns

`undefined` \| `Uint8Array`

Storage value or undefined

#### Defined in

node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/storage.d.ts:43

***

### put()

> **put**(`address`, `key`, `value`): `void`

Puts storage value to cache under address_key cache key.

#### Parameters

• **address**: `Address`

Account address

• **key**: `Uint8Array`

Storage key

• **value**: `Uint8Array`

#### Returns

`void`

#### Defined in

node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/storage.d.ts:34

***

### revert()

> **revert**(): `void`

Revert changes to cache last checkpoint (no effect on trie).

#### Returns

`void`

#### Defined in

node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/storage.d.ts:63

***

### size()

> **size**(): `number`

Returns the size of the cache

#### Returns

`number`

#### Defined in

node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/storage.d.ts:77

***

### stats()

> **stats**(`reset`?): `object`

Returns a dict with cache stats

#### Parameters

• **reset?**: `boolean`

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

#### Defined in

node\_modules/.pnpm/@ethereumjs+statemanager@2.4.0/node\_modules/@ethereumjs/statemanager/dist/esm/cache/storage.d.ts:82
