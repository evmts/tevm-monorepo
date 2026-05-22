[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / ContractCache

# Class: ContractCache

Defined in: [tevm-monorepo/packages/state/src/ContractCache.js:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L10)

Contract cache is a mapping of addresses to deployedBytecode
It is implemented via extending StorageCache and hardcoding slot 0

## Constructors

### Constructor

> **new ContractCache**(`storageCache?`): `ContractCache`

Defined in: [tevm-monorepo/packages/state/src/ContractCache.js:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L11)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `storageCache` | [`StorageCache`](StorageCache.md) |

#### Returns

`ContractCache`

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="storagecache"></a> `storageCache` | [`StorageCache`](StorageCache.md) | [tevm-monorepo/packages/state/src/ContractCache.js:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L17) |

## Accessors

### \_checkpoints

#### Get Signature

> **get** **\_checkpoints**(): `number`

Defined in: [tevm-monorepo/packages/state/src/ContractCache.js:77](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L77)

##### Returns

`number`

## Methods

### checkpoint()

> **checkpoint**(): `void`

Defined in: [tevm-monorepo/packages/state/src/ContractCache.js:62](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L62)

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: [tevm-monorepo/packages/state/src/ContractCache.js:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L30)

#### Returns

`void`

***

### commit()

> **commit**(): `void`

Defined in: [tevm-monorepo/packages/state/src/ContractCache.js:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L23)

#### Returns

`void`

***

### del()

> **del**(`address`): `void`

Defined in: [tevm-monorepo/packages/state/src/ContractCache.js:55](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L55)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `address` | `Address` | - |

#### Returns

`void`

***

### get()

> **get**(`address`): `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

Defined in: [tevm-monorepo/packages/state/src/ContractCache.js:38](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L38)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `address` | `Address` | - |

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

***

### has()

> **has**(`address`): `boolean`

Defined in: [tevm-monorepo/packages/state/src/ContractCache.js:70](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L70)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `address` | `Address` | - |

#### Returns

`boolean`

if the cache has the key

***

### put()

> **put**(`address`, `bytecode`): `void`

Defined in: [tevm-monorepo/packages/state/src/ContractCache.js:47](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L47)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `address` | `Address` | - |
| `bytecode` | `Uint8Array`\<`ArrayBufferLike`\> | - |

#### Returns

`void`

***

### revert()

> **revert**(): `void`

Defined in: [tevm-monorepo/packages/state/src/ContractCache.js:88](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L88)

#### Returns

`void`

***

### size()

> **size**(): `number`

Defined in: [tevm-monorepo/packages/state/src/ContractCache.js:81](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L81)

#### Returns

`number`
