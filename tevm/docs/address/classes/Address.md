[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [address](../README.md) / Address

# Class: Address

Defined in: packages/address/types/Address.d.ts:42

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

- [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

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

[`EthjsAddress`](../../utils/classes/EthjsAddress.md).[`constructor`](../../utils/classes/EthjsAddress.md#constructors)

## Properties

### bytes

> `readonly` **bytes**: `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:6

#### Inherited from

[`EthjsAddress`](../../utils/classes/EthjsAddress.md).[`bytes`](../../utils/classes/EthjsAddress.md#bytes-1)

## Methods

### equals()

> **equals**(`address`): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:43

Is address equal to another.

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`boolean`

#### Inherited from

[`EthjsAddress`](../../utils/classes/EthjsAddress.md).[`equals`](../../utils/classes/EthjsAddress.md#equals)

***

### isPrecompileOrSystemAddress()

> **isPrecompileOrSystemAddress**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:52

True if address is in the address range defined
by EIP-1352

#### Returns

`boolean`

#### Inherited from

[`EthjsAddress`](../../utils/classes/EthjsAddress.md).[`isPrecompileOrSystemAddress`](../../utils/classes/EthjsAddress.md#isprecompileorsystemaddress)

***

### isZero()

> **isZero**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:47

Is address zero.

#### Returns

`boolean`

#### Inherited from

[`EthjsAddress`](../../utils/classes/EthjsAddress.md).[`isZero`](../../utils/classes/EthjsAddress.md#iszero)

***

### toBytes()

> **toBytes**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:60

Returns a new Uint8Array representation of address.

#### Returns

`Uint8Array`

#### Inherited from

[`EthjsAddress`](../../utils/classes/EthjsAddress.md).[`toBytes`](../../utils/classes/EthjsAddress.md#tobytes)

***

### toString()

> **toString**(): `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:56

Returns hex encoding of address.

#### Returns

`` `0x${string}` ``

#### Inherited from

[`EthjsAddress`](../../utils/classes/EthjsAddress.md).[`toString`](../../utils/classes/EthjsAddress.md#tostring)

***

### fromPrivateKey()

> `static` **fromPrivateKey**(`privateKey`): [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:26

Returns an address for a given private key.

#### Parameters

##### privateKey

`Uint8Array`

A private key must be 256 bits wide

#### Returns

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Inherited from

[`EthjsAddress`](../../utils/classes/EthjsAddress.md).[`fromPrivateKey`](../../utils/classes/EthjsAddress.md#fromprivatekey)

***

### fromPublicKey()

> `static` **fromPublicKey**(`pubKey`): [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:21

Returns an address for a given public key.

#### Parameters

##### pubKey

`Uint8Array`

The two points of an uncompressed key

#### Returns

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Inherited from

[`EthjsAddress`](../../utils/classes/EthjsAddress.md).[`fromPublicKey`](../../utils/classes/EthjsAddress.md#frompublickey)

***

### fromString()

> `static` **fromString**(`str`): [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:16

Returns an Address object from a hex-encoded string.

#### Parameters

##### str

`string`

Hex-encoded address

#### Returns

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Inherited from

[`EthjsAddress`](../../utils/classes/EthjsAddress.md).[`fromString`](../../utils/classes/EthjsAddress.md#fromstring)

***

### generate()

> `static` **generate**(`from`, `nonce`): [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:32

Generates an address for a newly created contract.

#### Parameters

##### from

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

The address which is creating this new address

##### nonce

`bigint`

The nonce of the from account

#### Returns

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Inherited from

[`EthjsAddress`](../../utils/classes/EthjsAddress.md).[`generate`](../../utils/classes/EthjsAddress.md#generate)

***

### generate2()

> `static` **generate2**(`from`, `salt`, `initCode`): [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:39

Generates an address for a contract created using CREATE2.

#### Parameters

##### from

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

The address which is creating this new address

##### salt

`Uint8Array`

A salt

##### initCode

`Uint8Array`

The init code of the contract being created

#### Returns

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Inherited from

[`EthjsAddress`](../../utils/classes/EthjsAddress.md).[`generate2`](../../utils/classes/EthjsAddress.md#generate2)

***

### zero()

> `static` **zero**(): [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:11

Returns the zero address.

#### Returns

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Inherited from

[`EthjsAddress`](../../utils/classes/EthjsAddress.md).[`zero`](../../utils/classes/EthjsAddress.md#zero)
