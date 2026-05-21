[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / StorageCache

# Class: StorageCache

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:88

## Extends

- `Cache`

## Constructors

### Constructor

> **new StorageCache**(`opts`): `StorageCache`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:92

#### Parameters

##### opts

`CacheOpts`

#### Returns

`StorageCache`

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

> **\_diffCache**: `Map`\<`string`, `DiffStorageCacheMap`\>[]

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:91

***

### \_lruCache

> **\_lruCache**: `SimpleLRUCache`\<`string`, `StorageCacheMap`\> \| `undefined`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:89

***

### \_orderedMapCache

> **\_orderedMapCache**: `SimpleOrderedMap`\<`string`, `StorageCacheMap`\> \| `undefined`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:90

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

> **\_saveCachePreState**(`addressHex`, `keyHex`): `void`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:93

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

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

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

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

##### key

`Uint8Array`

#### Returns

`void`

***

### dump()

> **dump**(`address`): `StorageCacheMap` \| `undefined`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:105

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

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

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

##### key

`Uint8Array`

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

***

### put()

> **put**(`address`, `key`, `value`): `void`

Defined in: zevm/npm/zevm/dist/statemanager.d.ts:94

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

##### key

`Uint8Array`

##### value

`Uint8Array`

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

##### reset?

`boolean`

#### Returns

`CacheStats`
