---
editUrl: false
next: false
prev: false
title: "Address"
---

Utility class for Ethereum addresses.
Wraps [EthjsAddress](../../../../../../../../reference/tevm/utils/classes/ethjsaddress) with a tevm style API.
toString returns a checksummed address rather than lowercase.

## Example

```javascript
import { createAddress } from '@tevm/address';

// takes hex string
let address = createAddress(`0x${'00'.repeat(20)}`);
// takes number and bigint
address = createAddress(0);
// takes bytes
address = createAddress(new Uint8Array(20));
// non hex string
address = createAddress('55'.repeat(20));
```

## Extends

- [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

## Constructors

### new Address()

> **new Address**(`bytes`): [`Address`](/reference/tevm/address/classes/address/)

#### Parameters

• **bytes**: `Uint8Array`

#### Returns

[`Address`](/reference/tevm/address/classes/address/)

#### Inherited from

[`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/).[`constructor`](/reference/tevm/utils/classes/ethjsaddress/#constructors)

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:7

## Properties

### bytes

> `readonly` **bytes**: `Uint8Array`

#### Inherited from

[`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/).[`bytes`](/reference/tevm/utils/classes/ethjsaddress/#bytes)

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:6

## Methods

### equals()

> **equals**(`address`): `boolean`

Is address equal to another.

#### Parameters

• **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Returns

`boolean`

#### Inherited from

[`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/).[`equals`](/reference/tevm/utils/classes/ethjsaddress/#equals)

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:43

***

### isPrecompileOrSystemAddress()

> **isPrecompileOrSystemAddress**(): `boolean`

True if address is in the address range defined
by EIP-1352

#### Returns

`boolean`

#### Inherited from

[`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/).[`isPrecompileOrSystemAddress`](/reference/tevm/utils/classes/ethjsaddress/#isprecompileorsystemaddress)

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:52

***

### isZero()

> **isZero**(): `boolean`

Is address zero.

#### Returns

`boolean`

#### Inherited from

[`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/).[`isZero`](/reference/tevm/utils/classes/ethjsaddress/#iszero)

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:47

***

### toBytes()

> **toBytes**(): `Uint8Array`

Returns a new Uint8Array representation of address.

#### Returns

`Uint8Array`

#### Inherited from

[`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/).[`toBytes`](/reference/tevm/utils/classes/ethjsaddress/#tobytes)

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:60

***

### toString()

> **toString**(): \`0x$\{string\}\`

Returns the checksummed address.

#### Returns

\`0x$\{string\}\`

The checksummed Ethereum address as a string.

#### Overrides

[`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/).[`toString`](/reference/tevm/utils/classes/ethjsaddress/#tostring)

#### Defined in

[packages/address/src/Address.js:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/address/src/Address.js#L28)

***

### fromPrivateKey()

> `static` **fromPrivateKey**(`privateKey`): [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

Returns an address for a given private key.

#### Parameters

• **privateKey**: `Uint8Array`

A private key must be 256 bits wide

#### Returns

[`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Inherited from

[`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/).[`fromPrivateKey`](/reference/tevm/utils/classes/ethjsaddress/#fromprivatekey)

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:26

***

### fromPublicKey()

> `static` **fromPublicKey**(`pubKey`): [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

Returns an address for a given public key.

#### Parameters

• **pubKey**: `Uint8Array`

The two points of an uncompressed key

#### Returns

[`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Inherited from

[`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/).[`fromPublicKey`](/reference/tevm/utils/classes/ethjsaddress/#frompublickey)

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:21

***

### fromString()

> `static` **fromString**(`str`): [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

Returns an Address object from a hex-encoded string.

#### Parameters

• **str**: `string`

Hex-encoded address

#### Returns

[`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Inherited from

[`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/).[`fromString`](/reference/tevm/utils/classes/ethjsaddress/#fromstring)

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:16

***

### generate()

> `static` **generate**(`from`, `nonce`): [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

Generates an address for a newly created contract.

#### Parameters

• **from**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

The address which is creating this new address

• **nonce**: `bigint`

The nonce of the from account

#### Returns

[`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Inherited from

[`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/).[`generate`](/reference/tevm/utils/classes/ethjsaddress/#generate)

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:32

***

### generate2()

> `static` **generate2**(`from`, `salt`, `initCode`): [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

Generates an address for a contract created using CREATE2.

#### Parameters

• **from**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

The address which is creating this new address

• **salt**: `Uint8Array`

A salt

• **initCode**: `Uint8Array`

The init code of the contract being created

#### Returns

[`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Inherited from

[`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/).[`generate2`](/reference/tevm/utils/classes/ethjsaddress/#generate2)

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:39

***

### zero()

> `static` **zero**(): [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

Returns the zero address.

#### Returns

[`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Inherited from

[`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/).[`zero`](/reference/tevm/utils/classes/ethjsaddress/#zero)

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:11
