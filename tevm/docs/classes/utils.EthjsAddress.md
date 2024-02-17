[tevm](../README.md) / [Modules](../modules.md) / [utils](../modules/utils.md) / EthjsAddress

# Class: EthjsAddress

[utils](../modules/utils.md).EthjsAddress

Handling and generating Ethereum addresses

## Table of contents

### Constructors

- [constructor](utils.EthjsAddress.md#constructor)

### Properties

- [bytes](utils.EthjsAddress.md#bytes)

### Methods

- [equals](utils.EthjsAddress.md#equals)
- [isPrecompileOrSystemAddress](utils.EthjsAddress.md#isprecompileorsystemaddress)
- [isZero](utils.EthjsAddress.md#iszero)
- [toBytes](utils.EthjsAddress.md#tobytes)
- [toString](utils.EthjsAddress.md#tostring)
- [fromPrivateKey](utils.EthjsAddress.md#fromprivatekey)
- [fromPublicKey](utils.EthjsAddress.md#frompublickey)
- [fromString](utils.EthjsAddress.md#fromstring)
- [generate](utils.EthjsAddress.md#generate)
- [generate2](utils.EthjsAddress.md#generate2)
- [zero](utils.EthjsAddress.md#zero)

## Constructors

### constructor

• **new EthjsAddress**(`bytes`): [`EthjsAddress`](utils.EthjsAddress.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `bytes` | `Uint8Array` |

#### Returns

[`EthjsAddress`](utils.EthjsAddress.md)

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/address.d.ts:6

## Properties

### bytes

• `Readonly` **bytes**: `Uint8Array`

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/address.d.ts:5

## Methods

### equals

▸ **equals**(`address`): `boolean`

Is address equal to another.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EthjsAddress`](utils.EthjsAddress.md) |

#### Returns

`boolean`

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/address.d.ts:42

___

### isPrecompileOrSystemAddress

▸ **isPrecompileOrSystemAddress**(): `boolean`

True if address is in the address range defined
by EIP-1352

#### Returns

`boolean`

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/address.d.ts:51

___

### isZero

▸ **isZero**(): `boolean`

Is address zero.

#### Returns

`boolean`

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/address.d.ts:46

___

### toBytes

▸ **toBytes**(): `Uint8Array`

Returns a new Uint8Array representation of address.

#### Returns

`Uint8Array`

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/address.d.ts:59

___

### toString

▸ **toString**(): `string`

Returns hex encoding of address.

#### Returns

`string`

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/address.d.ts:55

___

### fromPrivateKey

▸ **fromPrivateKey**(`privateKey`): [`EthjsAddress`](utils.EthjsAddress.md)

Returns an address for a given private key.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `privateKey` | `Uint8Array` | A private key must be 256 bits wide |

#### Returns

[`EthjsAddress`](utils.EthjsAddress.md)

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/address.d.ts:25

___

### fromPublicKey

▸ **fromPublicKey**(`pubKey`): [`EthjsAddress`](utils.EthjsAddress.md)

Returns an address for a given public key.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pubKey` | `Uint8Array` | The two points of an uncompressed key |

#### Returns

[`EthjsAddress`](utils.EthjsAddress.md)

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/address.d.ts:20

___

### fromString

▸ **fromString**(`str`): [`EthjsAddress`](utils.EthjsAddress.md)

Returns an Address object from a hex-encoded string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `str` | `string` | Hex-encoded address |

#### Returns

[`EthjsAddress`](utils.EthjsAddress.md)

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/address.d.ts:15

___

### generate

▸ **generate**(`from`, `nonce`): [`EthjsAddress`](utils.EthjsAddress.md)

Generates an address for a newly created contract.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `from` | [`EthjsAddress`](utils.EthjsAddress.md) | The address which is creating this new address |
| `nonce` | `bigint` | The nonce of the from account |

#### Returns

[`EthjsAddress`](utils.EthjsAddress.md)

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/address.d.ts:31

___

### generate2

▸ **generate2**(`from`, `salt`, `initCode`): [`EthjsAddress`](utils.EthjsAddress.md)

Generates an address for a contract created using CREATE2.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `from` | [`EthjsAddress`](utils.EthjsAddress.md) | The address which is creating this new address |
| `salt` | `Uint8Array` | A salt |
| `initCode` | `Uint8Array` | The init code of the contract being created |

#### Returns

[`EthjsAddress`](utils.EthjsAddress.md)

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/address.d.ts:38

___

### zero

▸ **zero**(): [`EthjsAddress`](utils.EthjsAddress.md)

Returns the zero address.

#### Returns

[`EthjsAddress`](utils.EthjsAddress.md)

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/address.d.ts:10
