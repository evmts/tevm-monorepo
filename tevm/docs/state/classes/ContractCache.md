[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / ContractCache

# Class: ContractCache

<<<<<<< HEAD
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:217
=======
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:132
=======
Defined in: packages/state/dist/index.d.ts:217
>>>>>>> ceeee8122 (docs: generate docs)
>>>>>>> db7d1ce3d (docs: generate docs)
=======
Defined in: packages/state/dist/index.d.ts:132
>>>>>>> 7ba077856 (revert: docs commits)

Contract cache is a mapping of addresses to deployedBytecode
It is implemented via extending StorageCache and hardcoding slot 0

## Constructors

### Constructor

> **new ContractCache**(`storageCache?`): `ContractCache`

<<<<<<< HEAD
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:218
=======
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:133
=======
Defined in: packages/state/dist/index.d.ts:218
>>>>>>> ceeee8122 (docs: generate docs)
>>>>>>> db7d1ce3d (docs: generate docs)
=======
Defined in: packages/state/dist/index.d.ts:133
>>>>>>> 7ba077856 (revert: docs commits)

#### Parameters

##### storageCache?

[`StorageCache`](StorageCache.md)

#### Returns

`ContractCache`

## Properties

### storageCache

> **storageCache**: [`StorageCache`](StorageCache.md)

<<<<<<< HEAD
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:219
=======
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:134
=======
Defined in: packages/state/dist/index.d.ts:219
>>>>>>> ceeee8122 (docs: generate docs)
>>>>>>> db7d1ce3d (docs: generate docs)
=======
Defined in: packages/state/dist/index.d.ts:134
>>>>>>> 7ba077856 (revert: docs commits)

## Accessors

### \_checkpoints

#### Get Signature

> **get** **\_checkpoints**(): `number`

<<<<<<< HEAD
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:253
=======
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:168
=======
Defined in: packages/state/dist/index.d.ts:253
>>>>>>> ceeee8122 (docs: generate docs)
>>>>>>> db7d1ce3d (docs: generate docs)
=======
Defined in: packages/state/dist/index.d.ts:168
>>>>>>> 7ba077856 (revert: docs commits)

##### Returns

`number`

## Methods

### checkpoint()

> **checkpoint**(): `void`

<<<<<<< HEAD
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:247
=======
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:162
=======
Defined in: packages/state/dist/index.d.ts:247
>>>>>>> ceeee8122 (docs: generate docs)
>>>>>>> db7d1ce3d (docs: generate docs)
=======
Defined in: packages/state/dist/index.d.ts:162
>>>>>>> 7ba077856 (revert: docs commits)

#### Returns

`void`

***

### clear()

> **clear**(): `void`

<<<<<<< HEAD
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:227
=======
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:142
=======
Defined in: packages/state/dist/index.d.ts:227
>>>>>>> ceeee8122 (docs: generate docs)
>>>>>>> db7d1ce3d (docs: generate docs)
=======
Defined in: packages/state/dist/index.d.ts:142
>>>>>>> 7ba077856 (revert: docs commits)

#### Returns

`void`

***

### commit()

> **commit**(): `void`

<<<<<<< HEAD
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:223
=======
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:138
=======
Defined in: packages/state/dist/index.d.ts:223
>>>>>>> ceeee8122 (docs: generate docs)
>>>>>>> db7d1ce3d (docs: generate docs)
=======
Defined in: packages/state/dist/index.d.ts:138
>>>>>>> 7ba077856 (revert: docs commits)

#### Returns

`void`

***

### del()

> **del**(`address`): `void`

<<<<<<< HEAD
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:243
=======
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:158
=======
Defined in: packages/state/dist/index.d.ts:243
>>>>>>> ceeee8122 (docs: generate docs)
>>>>>>> db7d1ce3d (docs: generate docs)
=======
Defined in: packages/state/dist/index.d.ts:158
>>>>>>> 7ba077856 (revert: docs commits)

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`void`

***

### get()

> **get**(`address`): `undefined` \| `Uint8Array`\<`ArrayBufferLike`\>

<<<<<<< HEAD
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:232
=======
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:147
=======
Defined in: packages/state/dist/index.d.ts:232
>>>>>>> ceeee8122 (docs: generate docs)
>>>>>>> db7d1ce3d (docs: generate docs)
=======
Defined in: packages/state/dist/index.d.ts:147
>>>>>>> 7ba077856 (revert: docs commits)

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`undefined` \| `Uint8Array`\<`ArrayBufferLike`\>

***

### has()

> **has**(`address`): `boolean`

<<<<<<< HEAD
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:252
=======
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:167
=======
Defined in: packages/state/dist/index.d.ts:252
>>>>>>> ceeee8122 (docs: generate docs)
>>>>>>> db7d1ce3d (docs: generate docs)
=======
Defined in: packages/state/dist/index.d.ts:167
>>>>>>> 7ba077856 (revert: docs commits)

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`boolean`

if the cache has the key

***

### put()

> **put**(`address`, `bytecode`): `void`

<<<<<<< HEAD
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:238
=======
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:153
=======
Defined in: packages/state/dist/index.d.ts:238
>>>>>>> ceeee8122 (docs: generate docs)
>>>>>>> db7d1ce3d (docs: generate docs)
=======
Defined in: packages/state/dist/index.d.ts:153
>>>>>>> 7ba077856 (revert: docs commits)

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

##### bytecode

`Uint8Array`

#### Returns

`void`

***

### revert()

> **revert**(): `void`

<<<<<<< HEAD
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:258
=======
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:173
=======
Defined in: packages/state/dist/index.d.ts:258
>>>>>>> ceeee8122 (docs: generate docs)
>>>>>>> db7d1ce3d (docs: generate docs)
=======
Defined in: packages/state/dist/index.d.ts:173
>>>>>>> 7ba077856 (revert: docs commits)

#### Returns

`void`

***

### size()

> **size**(): `number`

<<<<<<< HEAD
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:254
=======
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:169
=======
Defined in: packages/state/dist/index.d.ts:254
>>>>>>> ceeee8122 (docs: generate docs)
>>>>>>> db7d1ce3d (docs: generate docs)
=======
Defined in: packages/state/dist/index.d.ts:169
>>>>>>> 7ba077856 (revert: docs commits)

#### Returns

`number`
