[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / ContractCache

# Class: ContractCache

Defined in: packages/state/dist/index.d.ts:244

Contract cache is a mapping of addresses to deployedBytecode
It is implemented via extending StorageCache and hardcoding slot 0

## Constructors

### Constructor

> **new ContractCache**(`storageCache?`): `ContractCache`

Defined in: packages/state/dist/index.d.ts:245

#### Parameters

##### storageCache?

[`StorageCache`](StorageCache.md)

#### Returns

`ContractCache`

## Properties

### storageCache

> **storageCache**: [`StorageCache`](StorageCache.md)

Defined in: packages/state/dist/index.d.ts:246

## Accessors

### \_checkpoints

#### Get Signature

> **get** **\_checkpoints**(): `number`

Defined in: packages/state/dist/index.d.ts:280

##### Returns

`number`

## Methods

### checkpoint()

> **checkpoint**(): `void`

Defined in: packages/state/dist/index.d.ts:274

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: packages/state/dist/index.d.ts:254

#### Returns

`void`

***

### commit()

> **commit**(): `void`

Defined in: packages/state/dist/index.d.ts:250

#### Returns

`void`

***

### del()

> **del**(`address`): `void`

Defined in: packages/state/dist/index.d.ts:270

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`void`

***

### get()

> **get**(`address`): `undefined` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: packages/state/dist/index.d.ts:259

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`undefined` \| `Uint8Array`\<`ArrayBufferLike`\>

***

### has()

> **has**(`address`): `boolean`

Defined in: packages/state/dist/index.d.ts:279

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`boolean`

if the cache has the key

***

### put()

> **put**(`address`, `bytecode`): `void`

Defined in: packages/state/dist/index.d.ts:265

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

Defined in: packages/state/dist/index.d.ts:285

#### Returns

`void`

***

### size()

> **size**(): `number`

Defined in: packages/state/dist/index.d.ts:281

#### Returns

`number`
