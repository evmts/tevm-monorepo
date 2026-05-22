[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / ContractCache

# Class: ContractCache

Contract cache is a mapping of addresses to deployedBytecode
It is implemented via extending StorageCache and hardcoding slot 0

## Constructors

### Constructor

> **new ContractCache**(`storageCache?`): `ContractCache`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `storageCache?` | [`StorageCache`](StorageCache.md) |

#### Returns

`ContractCache`

## Properties

| Property | Type |
| ------ | ------ |
| <a id="storagecache"></a> `storageCache` | [`StorageCache`](StorageCache.md) |

## Accessors

### \_checkpoints

#### Get Signature

> **get** **\_checkpoints**(): `number`

##### Returns

`number`

## Methods

### checkpoint()

> **checkpoint**(): `void`

#### Returns

`void`

***

### clear()

> **clear**(): `void`

#### Returns

`void`

***

### commit()

> **commit**(): `void`

#### Returns

`void`

***

### del()

> **del**(`address`): `void`

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `address` | [`EthjsAddress`](../../utils/classes/EthjsAddress.md) | - |

#### Returns

`void`

***

### get()

> **get**(`address`): `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `address` | [`EthjsAddress`](../../utils/classes/EthjsAddress.md) | - |

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

***

### has()

> **has**(`address`): `boolean`

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `address` | [`EthjsAddress`](../../utils/classes/EthjsAddress.md) | - |

#### Returns

`boolean`

if the cache has the key

***

### put()

> **put**(`address`, `bytecode`): `void`

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `address` | [`EthjsAddress`](../../utils/classes/EthjsAddress.md) | - |
| `bytecode` | `Uint8Array` | - |

#### Returns

`void`

***

### revert()

> **revert**(): `void`

#### Returns

`void`

***

### size()

> **size**(): `number`

#### Returns

`number`
