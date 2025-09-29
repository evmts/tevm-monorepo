[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / ContractCache

# Class: ContractCache

<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:132
=======
<<<<<<< HEAD
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:132
=======
Defined in: packages/state/dist/index.d.ts:217
>>>>>>> ceeee8122 (docs: generate docs)
=======
Defined in: packages/state/dist/index.d.ts:216
>>>>>>> 44031b740 (docs: generate all docs)
>>>>>>> f4f942332 (docs: generate all docs)

Contract cache is a mapping of addresses to deployedBytecode
It is implemented via extending StorageCache and hardcoding slot 0

## Constructors

### Constructor

> **new ContractCache**(`storageCache?`): `ContractCache`

<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:133
=======
<<<<<<< HEAD
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:133
=======
Defined in: packages/state/dist/index.d.ts:218
>>>>>>> ceeee8122 (docs: generate docs)
=======
Defined in: packages/state/dist/index.d.ts:217
>>>>>>> 44031b740 (docs: generate all docs)
>>>>>>> f4f942332 (docs: generate all docs)

#### Parameters

##### storageCache?

[`StorageCache`](StorageCache.md)

#### Returns

`ContractCache`

## Properties

### storageCache

> **storageCache**: [`StorageCache`](StorageCache.md)

<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:134
=======
<<<<<<< HEAD
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:134
=======
Defined in: packages/state/dist/index.d.ts:219
>>>>>>> ceeee8122 (docs: generate docs)
=======
Defined in: packages/state/dist/index.d.ts:218
>>>>>>> 44031b740 (docs: generate all docs)
>>>>>>> f4f942332 (docs: generate all docs)

## Accessors

### \_checkpoints

#### Get Signature

> **get** **\_checkpoints**(): `number`

<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:168
=======
<<<<<<< HEAD
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:168
=======
Defined in: packages/state/dist/index.d.ts:253
>>>>>>> ceeee8122 (docs: generate docs)
=======
Defined in: packages/state/dist/index.d.ts:252
>>>>>>> 44031b740 (docs: generate all docs)
>>>>>>> f4f942332 (docs: generate all docs)

##### Returns

`number`

## Methods

### checkpoint()

> **checkpoint**(): `void`

<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:162
=======
<<<<<<< HEAD
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:162
=======
Defined in: packages/state/dist/index.d.ts:247
>>>>>>> ceeee8122 (docs: generate docs)
=======
Defined in: packages/state/dist/index.d.ts:246
>>>>>>> 44031b740 (docs: generate all docs)
>>>>>>> f4f942332 (docs: generate all docs)

#### Returns

`void`

***

### clear()

> **clear**(): `void`

<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:142
=======
<<<<<<< HEAD
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:142
=======
Defined in: packages/state/dist/index.d.ts:227
>>>>>>> ceeee8122 (docs: generate docs)
=======
Defined in: packages/state/dist/index.d.ts:226
>>>>>>> 44031b740 (docs: generate all docs)
>>>>>>> f4f942332 (docs: generate all docs)

#### Returns

`void`

***

### commit()

> **commit**(): `void`

<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:138
=======
<<<<<<< HEAD
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:138
=======
Defined in: packages/state/dist/index.d.ts:223
>>>>>>> ceeee8122 (docs: generate docs)
=======
Defined in: packages/state/dist/index.d.ts:222
>>>>>>> 44031b740 (docs: generate all docs)
>>>>>>> f4f942332 (docs: generate all docs)

#### Returns

`void`

***

### del()

> **del**(`address`): `void`

<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:158
=======
<<<<<<< HEAD
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:158
=======
Defined in: packages/state/dist/index.d.ts:243
>>>>>>> ceeee8122 (docs: generate docs)
=======
Defined in: packages/state/dist/index.d.ts:242
>>>>>>> 44031b740 (docs: generate all docs)
>>>>>>> f4f942332 (docs: generate all docs)

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`void`

***

### get()

> **get**(`address`): `undefined` \| `Uint8Array`\<`ArrayBufferLike`\>

<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:147
=======
<<<<<<< HEAD
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:147
=======
Defined in: packages/state/dist/index.d.ts:232
>>>>>>> ceeee8122 (docs: generate docs)
=======
Defined in: packages/state/dist/index.d.ts:231
>>>>>>> 44031b740 (docs: generate all docs)
>>>>>>> f4f942332 (docs: generate all docs)

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`undefined` \| `Uint8Array`\<`ArrayBufferLike`\>

***

### has()

> **has**(`address`): `boolean`

<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:167
=======
<<<<<<< HEAD
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:167
=======
Defined in: packages/state/dist/index.d.ts:252
>>>>>>> ceeee8122 (docs: generate docs)
=======
Defined in: packages/state/dist/index.d.ts:251
>>>>>>> 44031b740 (docs: generate all docs)
>>>>>>> f4f942332 (docs: generate all docs)

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
Defined in: packages/state/dist/index.d.ts:153
=======
<<<<<<< HEAD
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:153
=======
Defined in: packages/state/dist/index.d.ts:238
>>>>>>> ceeee8122 (docs: generate docs)
=======
Defined in: packages/state/dist/index.d.ts:237
>>>>>>> 44031b740 (docs: generate all docs)
>>>>>>> f4f942332 (docs: generate all docs)

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
Defined in: packages/state/dist/index.d.ts:173
=======
<<<<<<< HEAD
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:173
=======
Defined in: packages/state/dist/index.d.ts:258
>>>>>>> ceeee8122 (docs: generate docs)
=======
Defined in: packages/state/dist/index.d.ts:257
>>>>>>> 44031b740 (docs: generate all docs)
>>>>>>> f4f942332 (docs: generate all docs)

#### Returns

`void`

***

### size()

> **size**(): `number`

<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:169
=======
<<<<<<< HEAD
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:169
=======
Defined in: packages/state/dist/index.d.ts:254
>>>>>>> ceeee8122 (docs: generate docs)
=======
Defined in: packages/state/dist/index.d.ts:253
>>>>>>> 44031b740 (docs: generate all docs)
>>>>>>> f4f942332 (docs: generate all docs)

#### Returns

`number`
