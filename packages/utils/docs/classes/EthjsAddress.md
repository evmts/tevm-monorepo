[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / EthjsAddress

# Class: EthjsAddress

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:5

Handling and generating Ethereum addresses

## Constructors

### Constructor

> **new EthjsAddress**(`bytes`): `Address`

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:7

#### Parameters

##### bytes

`Uint8Array`

#### Returns

`Address`

## Properties

### bytes

> `readonly` **bytes**: `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:6

## Methods

### equals()

> **equals**(`address`): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:11

Is address equal to another.

#### Parameters

##### address

`Address`

#### Returns

`boolean`

***

### isPrecompileOrSystemAddress()

> **isPrecompileOrSystemAddress**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:20

True if address is in the address range defined
by EIP-1352

#### Returns

`boolean`

***

### isZero()

> **isZero**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:15

Is address zero.

#### Returns

`boolean`

***

### toBytes()

> **toBytes**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:28

Returns a new Uint8Array representation of address.

#### Returns

`Uint8Array`

***

### toString()

> **toString**(): `` `0x${string}` ``

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0/node\_modules/@ethereumjs/util/dist/esm/address.d.ts:24

Returns hex encoding of address.

#### Returns

`` `0x${string}` ``
