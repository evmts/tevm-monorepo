**@tevm/evm** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > EthjsMessage

# Class: EthjsMessage

## Constructors

### new EthjsMessage(opts)

> **new EthjsMessage**(`opts`): [`EthjsMessage`](EthjsMessage.md)

#### Parameters

▪ **opts**: `MessageOpts`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:60

## Properties

### \_codeAddress

> **\_codeAddress**?: `Address`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:36

***

### authcallOrigin

> **authcallOrigin**?: `Address`

This is used to store the origin of the AUTHCALL,
the purpose is to figure out where `value` should be taken from (not from `caller`)

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:54

***

### blobVersionedHashes

> **blobVersionedHashes**?: `Uint8Array`[]

List of versioned hashes if message is a blob transaction in the outer VM

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:59

***

### caller

> **caller**: `Address`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:31

***

### code

> **code**?: `Uint8Array` \| `PrecompileFunc`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:35

***

### containerCode

> **containerCode**?: `Uint8Array`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:40

***

### createdAddresses

> **createdAddresses**?: `Set`\<`string`\>

Map of addresses which were created (used in EIP 6780)

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:48

***

### data

> **data**: `Uint8Array`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:33

***

### delegatecall

> **delegatecall**: `boolean`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:49

***

### depth

> **depth**: `number`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:34

***

### gasLimit

> **gasLimit**: `bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:32

***

### gasRefund

> **gasRefund**: `bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:55

***

### isCompiled

> **isCompiled**: `boolean`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:38

***

### isStatic

> **isStatic**: `boolean`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:37

***

### salt

> **salt**?: `Uint8Array`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:39

***

### selfdestruct

> **selfdestruct**?: `Set`\<`string`\>

Set of addresses to selfdestruct. Key is the unprefixed address.

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:44

***

### to

> **to**?: `Address`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:29

***

### value

> **value**: `bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:30

## Accessors

### codeAddress

> **`get`** **codeAddress**(): `Address`

Note: should only be called in instances where `_codeAddress` or `to` is defined.

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:64

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
