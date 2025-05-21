[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / EthjsAddress

# Class: EthjsAddress

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:5

Handling and generating Ethereum addresses

## Constructors

### Constructor

> **new EthjsAddress**(`bytes`): `Address`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:7

#### Parameters

##### bytes

`Uint8Array`

#### Returns

`Address`

## Properties

### bytes

> `readonly` **bytes**: `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:6

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

***

### isPrecompileOrSystemAddress()

> **isPrecompileOrSystemAddress**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:52

True if address is in the address range defined
by EIP-1352

#### Returns

`boolean`

***

### isZero()

> **isZero**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:47

Is address zero.

#### Returns

`boolean`

***

### toBytes()

> **toBytes**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:60

Returns a new Uint8Array representation of address.

#### Returns

`Uint8Array`

***

### toString()

> **toString**(): `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:56

Returns hex encoding of address.

#### Returns

`` `0x${string}` ``

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

***

### zero()

> `static` **zero**(): `Address`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:11

Returns the zero address.

#### Returns

`Address`
