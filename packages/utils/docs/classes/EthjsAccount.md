[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / EthjsAccount

# Class: EthjsAccount

Defined in: zevm/npm/zevm/dist/util.d.ts:175

## Constructors

### Constructor

> **new EthjsAccount**(`nonce?`, `balance?`, `storageRoot?`, `codeHash?`, `codeSize?`, `version?`): `Account`

Defined in: zevm/npm/zevm/dist/util.d.ts:182

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

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="_balance"></a> `_balance` | `bigint` \| `null` | zevm/npm/zevm/dist/util.d.ts:177 |
| <a id="_codehash"></a> `_codeHash` | `Uint8Array`\<`ArrayBufferLike`\> \| `null` | zevm/npm/zevm/dist/util.d.ts:179 |
| <a id="_codesize"></a> `_codeSize` | `number` \| `null` | zevm/npm/zevm/dist/util.d.ts:180 |
| <a id="_nonce"></a> `_nonce` | `bigint` \| `null` | zevm/npm/zevm/dist/util.d.ts:176 |
| <a id="_storageroot"></a> `_storageRoot` | `Uint8Array`\<`ArrayBufferLike`\> \| `null` | zevm/npm/zevm/dist/util.d.ts:178 |
| <a id="_version"></a> `_version` | `number` \| `null` | zevm/npm/zevm/dist/util.d.ts:181 |

## Accessors

### balance

#### Get Signature

> **get** **balance**(): `bigint`

Defined in: zevm/npm/zevm/dist/util.d.ts:187

##### Returns

`bigint`

#### Set Signature

> **set** **balance**(`balance`): `void`

Defined in: zevm/npm/zevm/dist/util.d.ts:188

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

Defined in: zevm/npm/zevm/dist/util.d.ts:191

##### Returns

`Uint8Array`

#### Set Signature

> **set** **codeHash**(`codeHash`): `void`

Defined in: zevm/npm/zevm/dist/util.d.ts:192

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

Defined in: zevm/npm/zevm/dist/util.d.ts:193

##### Returns

`number`

#### Set Signature

> **set** **codeSize**(`codeSize`): `void`

Defined in: zevm/npm/zevm/dist/util.d.ts:194

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

Defined in: zevm/npm/zevm/dist/util.d.ts:185

##### Returns

`bigint`

#### Set Signature

> **set** **nonce**(`nonce`): `void`

Defined in: zevm/npm/zevm/dist/util.d.ts:186

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

Defined in: zevm/npm/zevm/dist/util.d.ts:189

##### Returns

`Uint8Array`

#### Set Signature

> **set** **storageRoot**(`storageRoot`): `void`

Defined in: zevm/npm/zevm/dist/util.d.ts:190

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

Defined in: zevm/npm/zevm/dist/util.d.ts:183

##### Returns

`number`

#### Set Signature

> **set** **version**(`version`): `void`

Defined in: zevm/npm/zevm/dist/util.d.ts:184

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `version` | `number` |

##### Returns

`void`

## Methods

### \_validate()

> **\_validate**(): `void`

Defined in: zevm/npm/zevm/dist/util.d.ts:195

#### Returns

`void`

***

### isContract()

> **isContract**(): `boolean`

Defined in: zevm/npm/zevm/dist/util.d.ts:199

#### Returns

`boolean`

***

### isEmpty()

> **isEmpty**(): `boolean`

Defined in: zevm/npm/zevm/dist/util.d.ts:200

#### Returns

`boolean`

***

### raw()

> **raw**(): `Uint8Array`\<`ArrayBufferLike`\>[]

Defined in: zevm/npm/zevm/dist/util.d.ts:196

#### Returns

`Uint8Array`\<`ArrayBufferLike`\>[]

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: zevm/npm/zevm/dist/util.d.ts:197

#### Returns

`Uint8Array`

***

### serializeWithPartialInfo()

> **serializeWithPartialInfo**(): `Uint8Array`

Defined in: zevm/npm/zevm/dist/util.d.ts:198

#### Returns

`Uint8Array`
