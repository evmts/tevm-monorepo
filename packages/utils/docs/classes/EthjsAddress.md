[@tevm/utils](../README.md) / [Exports](../modules.md) / EthjsAddress

# Class: EthjsAddress

Handling and generating Ethereum addresses

## Table of contents

### Constructors

- [constructor](EthjsAddress.md#constructor)

### Properties

- [bytes](EthjsAddress.md#bytes)

### Methods

- [equals](EthjsAddress.md#equals)
- [isPrecompileOrSystemAddress](EthjsAddress.md#isprecompileorsystemaddress)
- [isZero](EthjsAddress.md#iszero)
- [toBytes](EthjsAddress.md#tobytes)
- [toString](EthjsAddress.md#tostring)
- [fromPrivateKey](EthjsAddress.md#fromprivatekey)
- [fromPublicKey](EthjsAddress.md#frompublickey)
- [fromString](EthjsAddress.md#fromstring)
- [generate](EthjsAddress.md#generate)
- [generate2](EthjsAddress.md#generate2)
- [zero](EthjsAddress.md#zero)

## Constructors

### constructor

• **new EthjsAddress**(`bytes`): [`EthjsAddress`](EthjsAddress.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `bytes` | `Uint8Array` |

#### Returns

[`EthjsAddress`](EthjsAddress.md)

#### Defined in

node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/address.d.ts:6

## Properties

### bytes

• `Readonly` **bytes**: `Uint8Array`

#### Defined in

node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/address.d.ts:5

## Methods

### equals

▸ **equals**(`address`): `boolean`

Is address equal to another.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EthjsAddress`](EthjsAddress.md) |

#### Returns

`boolean`

#### Defined in

node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/address.d.ts:42

___

### isPrecompileOrSystemAddress

▸ **isPrecompileOrSystemAddress**(): `boolean`

True if address is in the address range defined
by EIP-1352

#### Returns

`boolean`

#### Defined in

node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/address.d.ts:51

___

### isZero

▸ **isZero**(): `boolean`

Is address zero.

#### Returns

`boolean`

#### Defined in

node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/address.d.ts:46

___

### toBytes

▸ **toBytes**(): `Uint8Array`

Returns a new Uint8Array representation of address.

#### Returns

`Uint8Array`

#### Defined in

node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/address.d.ts:59

___

### toString

▸ **toString**(): `string`

Returns hex encoding of address.

#### Returns

`string`

#### Defined in

node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/address.d.ts:55

___

### fromPrivateKey

▸ **fromPrivateKey**(`privateKey`): [`EthjsAddress`](EthjsAddress.md)

Returns an address for a given private key.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `privateKey` | `Uint8Array` | A private key must be 256 bits wide |

#### Returns

[`EthjsAddress`](EthjsAddress.md)

#### Defined in

node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/address.d.ts:25

___

### fromPublicKey

▸ **fromPublicKey**(`pubKey`): [`EthjsAddress`](EthjsAddress.md)

Returns an address for a given public key.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pubKey` | `Uint8Array` | The two points of an uncompressed key |

#### Returns

[`EthjsAddress`](EthjsAddress.md)

#### Defined in

node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/address.d.ts:20

___

### fromString

▸ **fromString**(`str`): [`EthjsAddress`](EthjsAddress.md)

Returns an Address object from a hex-encoded string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `str` | `string` | Hex-encoded address |

#### Returns

[`EthjsAddress`](EthjsAddress.md)

#### Defined in

node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/address.d.ts:15

___

### generate

▸ **generate**(`from`, `nonce`): [`EthjsAddress`](EthjsAddress.md)

Generates an address for a newly created contract.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `from` | [`EthjsAddress`](EthjsAddress.md) | The address which is creating this new address |
| `nonce` | `bigint` | The nonce of the from account |

#### Returns

[`EthjsAddress`](EthjsAddress.md)

#### Defined in

node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/address.d.ts:31

___

### generate2

▸ **generate2**(`from`, `salt`, `initCode`): [`EthjsAddress`](EthjsAddress.md)

Generates an address for a contract created using CREATE2.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `from` | [`EthjsAddress`](EthjsAddress.md) | The address which is creating this new address |
| `salt` | `Uint8Array` | A salt |
| `initCode` | `Uint8Array` | The init code of the contract being created |

#### Returns

[`EthjsAddress`](EthjsAddress.md)

#### Defined in

node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/address.d.ts:38

___

### zero

▸ **zero**(): [`EthjsAddress`](EthjsAddress.md)

Returns the zero address.

#### Returns

[`EthjsAddress`](EthjsAddress.md)

#### Defined in

node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/address.d.ts:10
