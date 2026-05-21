[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [evm](../README.md) / EthjsMessage

# Class: EthjsMessage

## Constructors

### Constructor

> **new EthjsMessage**(`opts`): `Message`

#### Parameters

##### opts

`MessageOpts`

#### Returns

`Message`

## Properties

### \_codeAddress?

> `optional` **\_codeAddress?**: `Address`

***

### accessWitness?

> `optional` **accessWitness?**: `BinaryTreeAccessWitnessInterface`

***

### blobVersionedHashes?

> `optional` **blobVersionedHashes?**: `` `0x${string}` ``[]

List of versioned hashes if message is a blob transaction in the outer VM

***

### caller

> **caller**: `Address`

***

### chargeCodeAccesses?

> `optional` **chargeCodeAccesses?**: `boolean`

***

### code?

> `optional` **code?**: `Uint8Array`\<`ArrayBufferLike`\> \| `PrecompileFunc`

***

### createdAddresses?

> `optional` **createdAddresses?**: `Set`\<`` `0x${string}` ``\>

Map of addresses which were created (used in EIP 6780)

***

### data

> **data**: `Uint8Array`

***

### delegatecall

> **delegatecall**: `boolean`

***

### depth

> **depth**: `number`

***

### eof?

> `optional` **eof?**: `EOFEnv`

***

### eofCallData?

> `optional` **eofCallData?**: `Uint8Array`\<`ArrayBufferLike`\>

***

### gasLimit

> **gasLimit**: `bigint`

***

### gasRefund

> **gasRefund**: `bigint`

***

### isCompiled

> **isCompiled**: `boolean`

***

### isCreate?

> `optional` **isCreate?**: `boolean`

***

### isStatic

> **isStatic**: `boolean`

***

### salt?

> `optional` **salt?**: `Uint8Array`\<`ArrayBufferLike`\>

***

### selfdestruct?

> `optional` **selfdestruct?**: `Set`\<`` `0x${string}` ``\>

Set of addresses to selfdestruct. Key is the unprefixed address.

***

### to?

> `optional` **to?**: `Address`

***

### value

> **value**: `bigint`

## Accessors

### codeAddress

#### Get Signature

> **get** **codeAddress**(): `Address`

Note: should only be called in instances where `_codeAddress` or `to` is defined.

##### Returns

`Address`
