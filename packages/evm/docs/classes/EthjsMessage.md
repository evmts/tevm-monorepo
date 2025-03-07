[**@tevm/evm**](../README.md)

***

[@tevm/evm](../globals.md) / EthjsMessage

# Class: EthjsMessage

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:31

## Constructors

### new EthjsMessage()

> **new EthjsMessage**(`opts`): [`EthjsMessage`](EthjsMessage.md)

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:65

#### Parameters

##### opts

`MessageOpts`

#### Returns

[`EthjsMessage`](EthjsMessage.md)

## Properties

### \_codeAddress?

> `optional` **\_codeAddress**: `Address`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:39

***

### accessWitness?

> `optional` **accessWitness**: `AccessWitnessInterface`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:64

***

### authcallOrigin?

> `optional` **authcallOrigin**: `Address`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:58

This is used to store the origin of the AUTHCALL,
the purpose is to figure out where `value` should be taken from (not from `caller`)

***

### blobVersionedHashes?

> `optional` **blobVersionedHashes**: `Uint8Array`\<`ArrayBufferLike`\>[]

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:63

List of versioned hashes if message is a blob transaction in the outer VM

***

### caller

> **caller**: `Address`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:34

***

### chargeCodeAccesses?

> `optional` **chargeCodeAccesses**: `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:44

***

### code?

> `optional` **code**: `PrecompileFunc` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:38

***

### containerCode?

> `optional` **containerCode**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:43

***

### createdAddresses?

> `optional` **createdAddresses**: `Set`\<`` `0x${string}` ``\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:52

Map of addresses which were created (used in EIP 6780)

***

### data

> **data**: `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:36

***

### delegatecall

> **delegatecall**: `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:53

***

### depth

> **depth**: `number`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:37

***

### gasLimit

> **gasLimit**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:35

***

### gasRefund

> **gasRefund**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:59

***

### isCompiled

> **isCompiled**: `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:41

***

### isStatic

> **isStatic**: `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:40

***

### salt?

> `optional` **salt**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:42

***

### selfdestruct?

> `optional` **selfdestruct**: `Set`\<`` `0x${string}` ``\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:48

Set of addresses to selfdestruct. Key is the unprefixed address.

***

### to?

> `optional` **to**: `Address`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:32

***

### value

> **value**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:33

## Accessors

### codeAddress

#### Get Signature

> **get** **codeAddress**(): `Address`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:69

Note: should only be called in instances where `_codeAddress` or `to` is defined.

##### Returns

`Address`
