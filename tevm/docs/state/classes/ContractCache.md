[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / ContractCache

# Class: ContractCache

Defined in: tevm-monorepo/packages/state/dist/index.d.ts:248

Contract cache is a mapping of addresses to deployedBytecode
It is implemented via extending StorageCache and hardcoding slot 0

## Constructors

### Constructor

> **new ContractCache**(`storageCache?`): `ContractCache`

Defined in: tevm-monorepo/packages/state/dist/index.d.ts:249

#### Parameters

##### storageCache?

[`StorageCache`](StorageCache.md)

#### Returns

`ContractCache`

## Properties

### storageCache

> **storageCache**: [`StorageCache`](StorageCache.md)

Defined in: tevm-monorepo/packages/state/dist/index.d.ts:250

## Accessors

### \_checkpoints

#### Get Signature

> **get** **\_checkpoints**(): `number`

Defined in: tevm-monorepo/packages/state/dist/index.d.ts:284

##### Returns

`number`

## Methods

### checkpoint()

> **checkpoint**(): `void`

Defined in: tevm-monorepo/packages/state/dist/index.d.ts:278

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: tevm-monorepo/packages/state/dist/index.d.ts:258

#### Returns

`void`

***

### commit()

> **commit**(): `void`

Defined in: tevm-monorepo/packages/state/dist/index.d.ts:254

#### Returns

`void`

***

### del()

> **del**(`address`): `void`

Defined in: tevm-monorepo/packages/state/dist/index.d.ts:274

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`void`

***

### get()

> **get**(`address`): `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

Defined in: tevm-monorepo/packages/state/dist/index.d.ts:263

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

***

### has()

> **has**(`address`): `boolean`

Defined in: tevm-monorepo/packages/state/dist/index.d.ts:283

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`boolean`

if the cache has the key

***

### put()

> **put**(`address`, `bytecode`): `void`

Defined in: tevm-monorepo/packages/state/dist/index.d.ts:269

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

Defined in: tevm-monorepo/packages/state/dist/index.d.ts:289

#### Returns

`void`

***

### size()

> **size**(): `number`

Defined in: tevm-monorepo/packages/state/dist/index.d.ts:285

#### Returns

`number`
