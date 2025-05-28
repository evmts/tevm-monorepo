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

### Constructor

> **new Address**(`bytes`): `Address`

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:7

#### Parameters

##### bytes

`Uint8Array`

#### Returns

`Address`

#### Inherited from

[`EthjsAddress`](../../utils/classes/EthjsAddress.md).[`constructor`](../../utils/classes/EthjsAddress.md#constructor)

## Properties

### bytes

> `readonly` **bytes**: `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:6

#### Inherited from

[`EthjsAddress`](../../utils/classes/EthjsAddress.md).[`bytes`](../../utils/classes/EthjsAddress.md#bytes)

## Methods

### equals()

> **equals**(`address`): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:11

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

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:20

True if address is in the address range defined
by EIP-1352

#### Returns

`boolean`

#### Inherited from

[`EthjsAddress`](../../utils/classes/EthjsAddress.md).[`isPrecompileOrSystemAddress`](../../utils/classes/EthjsAddress.md#isprecompileorsystemaddress)

***

### isZero()

> **isZero**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:15

Is address zero.

#### Returns

`boolean`

#### Inherited from

[`EthjsAddress`](../../utils/classes/EthjsAddress.md).[`isZero`](../../utils/classes/EthjsAddress.md#iszero)

***

### toBytes()

> **toBytes**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:28

Returns a new Uint8Array representation of address.

#### Returns

`Uint8Array`

#### Inherited from

[`EthjsAddress`](../../utils/classes/EthjsAddress.md).[`toBytes`](../../utils/classes/EthjsAddress.md#tobytes)

***

### toString()

> **toString**(): `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:24

Returns hex encoding of address.

#### Returns

`` `0x${string}` ``

#### Inherited from

[`EthjsAddress`](../../utils/classes/EthjsAddress.md).[`toString`](../../utils/classes/EthjsAddress.md#tostring)
