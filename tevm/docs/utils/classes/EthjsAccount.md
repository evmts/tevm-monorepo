[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [utils](../README.md) / EthjsAccount

# Class: EthjsAccount

## Constructors

### Constructor

> **new EthjsAccount**(`nonce?`, `balance?`, `storageRoot?`, `codeHash?`, `codeSize?`, `version?`): `Account`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `nonce?` | `bigint` \| `null` |
| `balance?` | `bigint` \| `null` |
| `storageRoot?` | `Uint8Array`\<`ArrayBufferLike`\> \| `null` |
| `codeHash?` | `Uint8Array`\<`ArrayBufferLike`\> \| `null` |
| `codeSize?` | `number` \| `null` |
| `version?` | `number` \| `null` |

#### Returns

`Account`

## Properties

| Property | Type |
| ------ | ------ |
| <a id="_balance"></a> `_balance` | `bigint` \| `null` |
| <a id="_codehash"></a> `_codeHash` | `Uint8Array`\<`ArrayBufferLike`\> \| `null` |
| <a id="_codesize"></a> `_codeSize` | `number` \| `null` |
| <a id="_nonce"></a> `_nonce` | `bigint` \| `null` |
| <a id="_storageroot"></a> `_storageRoot` | `Uint8Array`\<`ArrayBufferLike`\> \| `null` |
| <a id="_version"></a> `_version` | `number` \| `null` |

## Accessors

### balance

#### Get Signature

> **get** **balance**(): `bigint`

##### Returns

`bigint`

#### Set Signature

> **set** **balance**(`balance`): `void`

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `balance` | `bigint` |

##### Returns

`void`

***

### codeHash

#### Get Signature

> **get** **codeHash**(): `Uint8Array`

##### Returns

`Uint8Array`

#### Set Signature

> **set** **codeHash**(`codeHash`): `void`

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `codeHash` | `Uint8Array` |

##### Returns

`void`

***

### codeSize

#### Get Signature

> **get** **codeSize**(): `number`

##### Returns

`number`

#### Set Signature

> **set** **codeSize**(`codeSize`): `void`

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `codeSize` | `number` |

##### Returns

`void`

***

### nonce

#### Get Signature

> **get** **nonce**(): `bigint`

##### Returns

`bigint`

#### Set Signature

> **set** **nonce**(`nonce`): `void`

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `nonce` | `bigint` |

##### Returns

`void`

***

### storageRoot

#### Get Signature

> **get** **storageRoot**(): `Uint8Array`

##### Returns

`Uint8Array`

#### Set Signature

> **set** **storageRoot**(`storageRoot`): `void`

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `storageRoot` | `Uint8Array` |

##### Returns

`void`

***

### version

#### Get Signature

> **get** **version**(): `number`

##### Returns

`number`

#### Set Signature

> **set** **version**(`version`): `void`

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `version` | `number` |

##### Returns

`void`

## Methods

### \_validate()

> **\_validate**(): `void`

#### Returns

`void`

***

### isContract()

> **isContract**(): `boolean`

#### Returns

`boolean`

***

### isEmpty()

> **isEmpty**(): `boolean`

#### Returns

`boolean`

***

### raw()

> **raw**(): `Uint8Array`\<`ArrayBufferLike`\>[]

#### Returns

`Uint8Array`\<`ArrayBufferLike`\>[]

***

### serialize()

> **serialize**(): `Uint8Array`

#### Returns

`Uint8Array`

***

### serializeWithPartialInfo()

> **serializeWithPartialInfo**(): `Uint8Array`

#### Returns

`Uint8Array`
