[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [evm](../README.md) / EthjsMessage

# Class: EthjsMessage

## Constructors

### new EthjsMessage()

> **new EthjsMessage**(`opts`): [`EthjsMessage`](EthjsMessage.md)

#### Parameters

• **opts**: `MessageOpts`

#### Returns

[`EthjsMessage`](EthjsMessage.md)

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:65

## Properties

### \_codeAddress?

> `optional` **\_codeAddress**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:39

***

### accessWitness?

> `optional` **accessWitness**: `AccessWitnessInterface`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:64

***

### authcallOrigin?

> `optional` **authcallOrigin**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

This is used to store the origin of the AUTHCALL,
the purpose is to figure out where `value` should be taken from (not from `caller`)

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:58

***

### blobVersionedHashes?

> `optional` **blobVersionedHashes**: `Uint8Array`[]

List of versioned hashes if message is a blob transaction in the outer VM

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:63

***

### caller

> **caller**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:34

***

### chargeCodeAccesses?

> `optional` **chargeCodeAccesses**: `boolean`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:44

***

### code?

> `optional` **code**: `Uint8Array` \| `PrecompileFunc`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:38

***

### containerCode?

> `optional` **containerCode**: `Uint8Array`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:43

***

### createdAddresses?

> `optional` **createdAddresses**: `Set`\<\`0x$\{string\}\`\>

Map of addresses which were created (used in EIP 6780)

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:52

***

### data

> **data**: `Uint8Array`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:36

***

### delegatecall

> **delegatecall**: `boolean`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:53

***

### depth

> **depth**: `number`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:37

***

### gasLimit

> **gasLimit**: `bigint`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:35

***

### gasRefund

> **gasRefund**: `bigint`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:59

***

### isCompiled

> **isCompiled**: `boolean`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:41

***

### isStatic

> **isStatic**: `boolean`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:40

***

### salt?

> `optional` **salt**: `Uint8Array`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:42

***

### selfdestruct?

> `optional` **selfdestruct**: `Set`\<\`0x$\{string\}\`\>

Set of addresses to selfdestruct. Key is the unprefixed address.

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:48

***

### to?

> `optional` **to**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:32

***

### value

> **value**: `bigint`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:33

## Accessors

### codeAddress

> `get` **codeAddress**(): [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Note: should only be called in instances where `_codeAddress` or `to` is defined.

#### Returns

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/message.d.ts:69
