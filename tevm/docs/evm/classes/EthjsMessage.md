[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [evm](../README.md) / EthjsMessage

# Class: EthjsMessage

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:31

## Constructors

### Constructor

> **new EthjsMessage**(`opts`): `Message`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:62

#### Parameters

##### opts

`MessageOpts`

#### Returns

`Message`

## Properties

### \_codeAddress?

> `optional` **\_codeAddress**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:41

***

### accessWitness?

> `optional` **accessWitness**: `VerkleAccessWitnessInterface` \| `BinaryTreeAccessWitnessInterface`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:61

***

### blobVersionedHashes?

> `optional` **blobVersionedHashes**: `` `0x${string}` ``[]

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:60

List of versioned hashes if message is a blob transaction in the outer VM

***

### caller

> **caller**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:34

***

### chargeCodeAccesses?

> `optional` **chargeCodeAccesses**: `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:46

***

### code?

> `optional` **code**: `Uint8Array`\<`ArrayBufferLike`\> \| `PrecompileFunc`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:40

***

### createdAddresses?

> `optional` **createdAddresses**: `Set`\<`` `0x${string}` ``\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:54

Map of addresses which were created (used in EIP 6780)

***

### data

> **data**: `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:36

***

### delegatecall

> **delegatecall**: `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:55

***

### depth

> **depth**: `number`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:39

***

### eof?

> `optional` **eof**: `EOFEnv`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:45

***

### eofCallData?

> `optional` **eofCallData**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:37

***

### gasLimit

> **gasLimit**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:35

***

### gasRefund

> **gasRefund**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:56

***

### isCompiled

> **isCompiled**: `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:43

***

### isCreate?

> `optional` **isCreate**: `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:38

***

### isStatic

> **isStatic**: `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:42

***

### salt?

> `optional` **salt**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:44

***

### selfdestruct?

> `optional` **selfdestruct**: `Set`\<`` `0x${string}` ``\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:50

Set of addresses to selfdestruct. Key is the unprefixed address.

***

### to?

> `optional` **to**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:32

***

### value

> **value**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:33

## Accessors

### codeAddress

#### Get Signature

> **get** **codeAddress**(): [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:66

Note: should only be called in instances where `_codeAddress` or `to` is defined.

##### Returns

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)
