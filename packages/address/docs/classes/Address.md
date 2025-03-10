[**@tevm/address**](../README.md)

***

[@tevm/address](../globals.md) / Address

# Class: Address

Defined in: [packages/address/src/Address.js:44](https://github.com/evmts/tevm-monorepo/blob/main/packages/address/src/Address.js#L44)

A specialized Ethereum address class that extends EthjsAddress with TEVM-specific
functionality. This class provides EIP-55 compliant checksummed address formatting
and consistent behavior across the TEVM ecosystem.

The Address class is the core representation of Ethereum addresses in TEVM's
low-level APIs. It handles the complexities of Ethereum addresses including:
- Proper hex encoding/decoding
- EIP-55 checksumming for error detection
- Consistent 20-byte binary representation

This class should typically be created using the `createAddress` factory function
rather than being instantiated directly.

## Example

```javascript
import { createAddress } from '@tevm/address';

// From checksummed hex string
let address = createAddress('0x8ba1f109551bD432803012645Ac136ddd64DBA72');

// From lowercase hex string
address = createAddress('0x8ba1f109551bd432803012645ac136ddd64dba72');

// From zero address
address = createAddress(`0x${'00'.repeat(20)}`);

// From number or bigint
address = createAddress(0);
address = createAddress(123456789n);

// From Uint8Array
address = createAddress(new Uint8Array(20));

// From unprefixed hex string
address = createAddress('8ba1f109551bd432803012645ac136ddd64dba72');
```

## See

[Mixed-case checksum address encoding](https://eips.ethereum.org/EIPS/eip-55|EIP-55:)

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

Defined in: [packages/address/src/Address.js:63](https://github.com/evmts/tevm-monorepo/blob/main/packages/address/src/Address.js#L63)

Returns the checksummed EIP-55 compliant address string.

Unlike the parent EthjsAddress class which returns lowercase strings,
this implementation returns properly checksummed addresses for improved
safety, readability, and compatibility.

#### Returns

`` `0x${string}` ``

The checksummed Ethereum address as a string.

#### Example

```javascript
import { createAddress } from '@tevm/address';

const address = createAddress('0x8ba1f109551bd432803012645ac136ddd64dba72');
console.log(address.toString()); // '0x8ba1f109551bD432803012645Ac136ddd64DBA72'
```

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
