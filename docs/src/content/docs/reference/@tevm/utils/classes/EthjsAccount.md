---
editUrl: false
next: false
prev: false
title: "EthjsAccount"
---

## Constructors

### new EthjsAccount(nonce, balance, storageRoot, codeHash)

> **new EthjsAccount**(`nonce`?, `balance`?, `storageRoot`?, `codeHash`?): [`EthjsAccount`](/reference/tevm/utils/classes/ethjsaccount/)

This constructor assigns and validates the values.
Use the static factory methods to assist in creating an Account from varying data types.

#### Parameters

▪ **nonce?**: `bigint`

▪ **balance?**: `bigint`

▪ **storageRoot?**: `Uint8Array`

▪ **codeHash?**: `Uint8Array`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.1/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:21

## Properties

### \_validate

> **`private`** **\_validate**: `any`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.1/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:22

***

### balance

> **balance**: `bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.1/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:11

***

### codeHash

> **codeHash**: `Uint8Array`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.1/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:13

***

### nonce

> **nonce**: `bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.1/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:10

***

### storageRoot

> **storageRoot**: `Uint8Array`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.1/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:12

## Methods

### isContract()

> **isContract**(): `boolean`

Returns a `Boolean` determining if the account is a contract.

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.1/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:34

***

### isEmpty()

> **isEmpty**(): `boolean`

Returns a `Boolean` determining if the account is empty complying to the definition of
account emptiness in [EIP-161](https://eips.ethereum.org/EIPS/eip-161):
"An account is considered empty when it has no code and zero nonce and zero balance."

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.1/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:40

***

### raw()

> **raw**(): `Uint8Array`[]

Returns an array of Uint8Arrays of the raw bytes for the account, in order.

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.1/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:26

***

### serialize()

> **serialize**(): `Uint8Array`

Returns the RLP serialization of the account as a `Uint8Array`.

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.1/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:30

***

### fromAccountData()

> **`static`** **fromAccountData**(`accountData`): [`EthjsAccount`](/reference/tevm/utils/classes/ethjsaccount/)

#### Parameters

▪ **accountData**: `AccountData`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.1/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:14

***

### fromRlpSerializedAccount()

> **`static`** **fromRlpSerializedAccount**(`serialized`): [`EthjsAccount`](/reference/tevm/utils/classes/ethjsaccount/)

#### Parameters

▪ **serialized**: `Uint8Array`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.1/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:15

***

### fromValuesArray()

> **`static`** **fromValuesArray**(`values`): [`EthjsAccount`](/reference/tevm/utils/classes/ethjsaccount/)

#### Parameters

▪ **values**: `Uint8Array`[]

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.1/node\_modules/@ethereumjs/util/dist/esm/account.d.ts:16

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
