---
editUrl: false
next: false
prev: false
title: "EthjsMessage"
---

## Constructors

### new EthjsMessage()

> **new EthjsMessage**(`opts`): [`EthjsMessage`](/reference/tevm/evm/classes/ethjsmessage-1/)

#### Parameters

• **opts**: `MessageOpts`

#### Returns

[`EthjsMessage`](/reference/tevm/evm/classes/ethjsmessage-1/)

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:64

## Properties

### \_codeAddress?

> `optional` **\_codeAddress**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:38

***

### accessWitness?

> `optional` **accessWitness**: `AccessWitness`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:63

***

### authcallOrigin?

> `optional` **authcallOrigin**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

This is used to store the origin of the AUTHCALL,
the purpose is to figure out where `value` should be taken from (not from `caller`)

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:57

***

### blobVersionedHashes?

> `optional` **blobVersionedHashes**: `Uint8Array`[]

List of versioned hashes if message is a blob transaction in the outer VM

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:62

***

### caller

> **caller**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:33

***

### chargeCodeAccesses?

> `optional` **chargeCodeAccesses**: `boolean`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:43

***

### code?

> `optional` **code**: `Uint8Array` \| `PrecompileFunc`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:37

***

### containerCode?

> `optional` **containerCode**: `Uint8Array`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:42

***

### createdAddresses?

> `optional` **createdAddresses**: `Set`\<`string`\>

Map of addresses which were created (used in EIP 6780)

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:51

***

### data

> **data**: `Uint8Array`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:35

***

### delegatecall

> **delegatecall**: `boolean`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:52

***

### depth

> **depth**: `number`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:36

***

### gasLimit

> **gasLimit**: `bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:34

***

### gasRefund

> **gasRefund**: `bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:58

***

### isCompiled

> **isCompiled**: `boolean`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:40

***

### isStatic

> **isStatic**: `boolean`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:39

***

### salt?

> `optional` **salt**: `Uint8Array`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:41

***

### selfdestruct?

> `optional` **selfdestruct**: `Set`\<`string`\>

Set of addresses to selfdestruct. Key is the unprefixed address.

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:47

***

### to?

> `optional` **to**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:31

***

### value

> **value**: `bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:32

## Accessors

### codeAddress

> `get` **codeAddress**(): [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

Note: should only be called in instances where `_codeAddress` or `to` is defined.

#### Returns

[`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:68
