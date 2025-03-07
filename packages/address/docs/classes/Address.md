[**@tevm/address**](../README.md)

***

[@tevm/address](../globals.md) / Address

# Class: Address

Defined in: [packages/address/src/Address.js:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/address/src/Address.js#L22)

Utility class for Ethereum addresses.
Wraps EthjsAddress with a tevm style API.
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

- `Address`

## Constructors

### new Address()

> **new Address**(`bytes`): [`Address`](Address.md)

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:7

#### Parameters

##### bytes

`Uint8Array`

#### Returns

[`Address`](Address.md)

#### Inherited from

`EthjsAddress.constructor`

## Properties

### bytes

> `readonly` **bytes**: `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:6

#### Inherited from

`EthjsAddress.bytes`

## Methods

### equals()

> **equals**(`address`): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:43

Is address equal to another.

#### Parameters

##### address

`Address`

#### Returns

`boolean`

#### Inherited from

`EthjsAddress.equals`

***

### isPrecompileOrSystemAddress()

> **isPrecompileOrSystemAddress**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:52

True if address is in the address range defined
by EIP-1352

#### Returns

`boolean`

#### Inherited from

`EthjsAddress.isPrecompileOrSystemAddress`

***

### isZero()

> **isZero**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:47

Is address zero.

#### Returns

`boolean`

#### Inherited from

`EthjsAddress.isZero`

***

### toBytes()

> **toBytes**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:60

Returns a new Uint8Array representation of address.

#### Returns

`Uint8Array`

#### Inherited from

`EthjsAddress.toBytes`

***

### toString()

> **toString**(): `` `0x${string}` ``

Defined in: [packages/address/src/Address.js:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/address/src/Address.js#L28)

Returns the checksummed address.

#### Returns

`` `0x${string}` ``

The checksummed Ethereum address as a string.

#### Overrides

`EthjsAddress.toString`

***

### fromPrivateKey()

> `static` **fromPrivateKey**(`privateKey`): `Address`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:26

Returns an address for a given private key.

#### Parameters

##### privateKey

`Uint8Array`

A private key must be 256 bits wide

#### Returns

`Address`

#### Inherited from

`EthjsAddress.fromPrivateKey`

***

### fromPublicKey()

> `static` **fromPublicKey**(`pubKey`): `Address`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:21

Returns an address for a given public key.

#### Parameters

##### pubKey

`Uint8Array`

The two points of an uncompressed key

#### Returns

`Address`

#### Inherited from

`EthjsAddress.fromPublicKey`

***

### fromString()

> `static` **fromString**(`str`): `Address`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:16

Returns an Address object from a hex-encoded string.

#### Parameters

##### str

`string`

Hex-encoded address

#### Returns

`Address`

#### Inherited from

`EthjsAddress.fromString`

***

### generate()

> `static` **generate**(`from`, `nonce`): `Address`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:32

Generates an address for a newly created contract.

#### Parameters

##### from

`Address`

The address which is creating this new address

##### nonce

`bigint`

The nonce of the from account

#### Returns

`Address`

#### Inherited from

`EthjsAddress.generate`

***

### generate2()

> `static` **generate2**(`from`, `salt`, `initCode`): `Address`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:39

Generates an address for a contract created using CREATE2.

#### Parameters

##### from

`Address`

The address which is creating this new address

##### salt

`Uint8Array`

A salt

##### initCode

`Uint8Array`

The init code of the contract being created

#### Returns

`Address`

#### Inherited from

`EthjsAddress.generate2`

***

### zero()

> `static` **zero**(): `Address`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:11

Returns the zero address.

#### Returns

`Address`

#### Inherited from

`EthjsAddress.zero`
