[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [address](../README.md) / Address

# Class: Address

Utility class for Ethereum addresses.
Wraps [EthjsAddress](../../utils/classes/EthjsAddress.md) with a tevm style API.
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

- [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

## Constructors

### new Address()

> **new Address**(`bytes`): [`Address`](Address.md)

#### Parameters

• **bytes**: `Uint8Array`

#### Returns

[`Address`](Address.md)

#### Inherited from

[`EthjsAddress`](../../utils/classes/EthjsAddress.md).[`constructor`](../../utils/classes/EthjsAddress.md#constructors)

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:7

## Properties

### bytes

> `readonly` **bytes**: `Uint8Array`

#### Inherited from

[`EthjsAddress`](../../utils/classes/EthjsAddress.md).[`bytes`](../../utils/classes/EthjsAddress.md#bytes)

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:6

## Methods

### equals()

> **equals**(`address`): `boolean`

Is address equal to another.

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`boolean`

#### Inherited from

[`EthjsAddress`](../../utils/classes/EthjsAddress.md).[`equals`](../../utils/classes/EthjsAddress.md#equals)

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

[`EthjsAddress`](../../utils/classes/EthjsAddress.md).[`isPrecompileOrSystemAddress`](../../utils/classes/EthjsAddress.md#isprecompileorsystemaddress)

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:52

***

### isZero()

> **isZero**(): `boolean`

Is address zero.

#### Returns

`boolean`

#### Inherited from

[`EthjsAddress`](../../utils/classes/EthjsAddress.md).[`isZero`](../../utils/classes/EthjsAddress.md#iszero)

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:47

***

### toBytes()

> **toBytes**(): `Uint8Array`

Returns a new Uint8Array representation of address.

#### Returns

`Uint8Array`

#### Inherited from

[`EthjsAddress`](../../utils/classes/EthjsAddress.md).[`toBytes`](../../utils/classes/EthjsAddress.md#tobytes)

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:60

***

### toString()

> **toString**(): \`0x$\{string\}\`

Returns hex encoding of address.

#### Returns

\`0x$\{string\}\`

#### Inherited from

[`EthjsAddress`](../../utils/classes/EthjsAddress.md).[`toString`](../../utils/classes/EthjsAddress.md#tostring)

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:56

***

### fromPrivateKey()

> `static` **fromPrivateKey**(`privateKey`): [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Returns an address for a given private key.

#### Parameters

• **privateKey**: `Uint8Array`

A private key must be 256 bits wide

#### Returns

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Inherited from

[`EthjsAddress`](../../utils/classes/EthjsAddress.md).[`fromPrivateKey`](../../utils/classes/EthjsAddress.md#fromprivatekey)

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:26

***

### fromPublicKey()

> `static` **fromPublicKey**(`pubKey`): [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Returns an address for a given public key.

#### Parameters

• **pubKey**: `Uint8Array`

The two points of an uncompressed key

#### Returns

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Inherited from

[`EthjsAddress`](../../utils/classes/EthjsAddress.md).[`fromPublicKey`](../../utils/classes/EthjsAddress.md#frompublickey)

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:21

***

### fromString()

> `static` **fromString**(`str`): [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Returns an Address object from a hex-encoded string.

#### Parameters

• **str**: `string`

Hex-encoded address

#### Returns

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Inherited from

[`EthjsAddress`](../../utils/classes/EthjsAddress.md).[`fromString`](../../utils/classes/EthjsAddress.md#fromstring)

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:16

***

### generate()

> `static` **generate**(`from`, `nonce`): [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Generates an address for a newly created contract.

#### Parameters

• **from**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

The address which is creating this new address

• **nonce**: `bigint`

The nonce of the from account

#### Returns

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Inherited from

[`EthjsAddress`](../../utils/classes/EthjsAddress.md).[`generate`](../../utils/classes/EthjsAddress.md#generate)

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:32

***

### generate2()

> `static` **generate2**(`from`, `salt`, `initCode`): [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Generates an address for a contract created using CREATE2.

#### Parameters

• **from**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

The address which is creating this new address

• **salt**: `Uint8Array`

A salt

• **initCode**: `Uint8Array`

The init code of the contract being created

#### Returns

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Inherited from

[`EthjsAddress`](../../utils/classes/EthjsAddress.md).[`generate2`](../../utils/classes/EthjsAddress.md#generate2)

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:39

***

### zero()

> `static` **zero**(): [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Returns the zero address.

#### Returns

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Inherited from

[`EthjsAddress`](../../utils/classes/EthjsAddress.md).[`zero`](../../utils/classes/EthjsAddress.md#zero)

#### Defined in

node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:11
