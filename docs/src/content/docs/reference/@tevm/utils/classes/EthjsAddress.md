---
editUrl: false
next: false
prev: false
title: "EthjsAddress"
---

Handling and generating Ethereum addresses

## Constructors

### new EthjsAddress(bytes)

> **new EthjsAddress**(`bytes`): [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Parameters

▪ **bytes**: `Uint8Array`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.1/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:6

## Properties

### bytes

> **`readonly`** **bytes**: `Uint8Array`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.1/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:5

## Methods

### equals()

> **equals**(`address`): `boolean`

Is address equal to another.

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.1/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:42

***

### isPrecompileOrSystemAddress()

> **isPrecompileOrSystemAddress**(): `boolean`

True if address is in the address range defined
by EIP-1352

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.1/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:51

***

### isZero()

> **isZero**(): `boolean`

Is address zero.

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.1/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:46

***

### toBytes()

> **toBytes**(): `Uint8Array`

Returns a new Uint8Array representation of address.

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.1/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:59

***

### toString()

> **toString**(): `string`

Returns hex encoding of address.

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.1/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:55

***

### fromPrivateKey()

> **`static`** **fromPrivateKey**(`privateKey`): [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

Returns an address for a given private key.

#### Parameters

▪ **privateKey**: `Uint8Array`

A private key must be 256 bits wide

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.1/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:25

***

### fromPublicKey()

> **`static`** **fromPublicKey**(`pubKey`): [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

Returns an address for a given public key.

#### Parameters

▪ **pubKey**: `Uint8Array`

The two points of an uncompressed key

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.1/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:20

***

### fromString()

> **`static`** **fromString**(`str`): [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

Returns an Address object from a hex-encoded string.

#### Parameters

▪ **str**: `string`

Hex-encoded address

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.1/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:15

***

### generate()

> **`static`** **generate**(`from`, `nonce`): [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

Generates an address for a newly created contract.

#### Parameters

▪ **from**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

The address which is creating this new address

▪ **nonce**: `bigint`

The nonce of the from account

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.1/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:31

***

### generate2()

> **`static`** **generate2**(`from`, `salt`, `initCode`): [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

Generates an address for a contract created using CREATE2.

#### Parameters

▪ **from**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

The address which is creating this new address

▪ **salt**: `Uint8Array`

A salt

▪ **initCode**: `Uint8Array`

The init code of the contract being created

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.1/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:38

***

### zero()

> **`static`** **zero**(): [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

Returns the zero address.

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.1/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:10

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
