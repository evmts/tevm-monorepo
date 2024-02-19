[tevm](../README.md) / [Modules](../modules.md) / [utils](../modules/utils.md) / EthjsAccount

# Class: EthjsAccount

[utils](../modules/utils.md).EthjsAccount

## Table of contents

### Constructors

- [constructor](utils.EthjsAccount.md#constructor)

### Properties

- [\_validate](utils.EthjsAccount.md#_validate)
- [balance](utils.EthjsAccount.md#balance)
- [codeHash](utils.EthjsAccount.md#codehash)
- [nonce](utils.EthjsAccount.md#nonce)
- [storageRoot](utils.EthjsAccount.md#storageroot)

### Methods

- [isContract](utils.EthjsAccount.md#iscontract)
- [isEmpty](utils.EthjsAccount.md#isempty)
- [raw](utils.EthjsAccount.md#raw)
- [serialize](utils.EthjsAccount.md#serialize)
- [fromAccountData](utils.EthjsAccount.md#fromaccountdata)
- [fromRlpSerializedAccount](utils.EthjsAccount.md#fromrlpserializedaccount)
- [fromValuesArray](utils.EthjsAccount.md#fromvaluesarray)

## Constructors

### constructor

• **new EthjsAccount**(`nonce?`, `balance?`, `storageRoot?`, `codeHash?`): [`EthjsAccount`](utils.EthjsAccount.md)

This constructor assigns and validates the values.
Use the static factory methods to assist in creating an Account from varying data types.

#### Parameters

| Name | Type |
| :------ | :------ |
| `nonce?` | `bigint` |
| `balance?` | `bigint` |
| `storageRoot?` | `Uint8Array` |
| `codeHash?` | `Uint8Array` |

#### Returns

[`EthjsAccount`](utils.EthjsAccount.md)

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/account.d.ts:21

## Properties

### \_validate

• `Private` **\_validate**: `any`

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/account.d.ts:22

___

### balance

• **balance**: `bigint`

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/account.d.ts:11

___

### codeHash

• **codeHash**: `Uint8Array`

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/account.d.ts:13

___

### nonce

• **nonce**: `bigint`

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/account.d.ts:10

___

### storageRoot

• **storageRoot**: `Uint8Array`

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/account.d.ts:12

## Methods

### isContract

▸ **isContract**(): `boolean`

Returns a `Boolean` determining if the account is a contract.

#### Returns

`boolean`

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/account.d.ts:34

___

### isEmpty

▸ **isEmpty**(): `boolean`

Returns a `Boolean` determining if the account is empty complying to the definition of
account emptiness in [EIP-161](https://eips.ethereum.org/EIPS/eip-161):
"An account is considered empty when it has no code and zero nonce and zero balance."

#### Returns

`boolean`

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/account.d.ts:40

___

### raw

▸ **raw**(): `Uint8Array`[]

Returns an array of Uint8Arrays of the raw bytes for the account, in order.

#### Returns

`Uint8Array`[]

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/account.d.ts:26

___

### serialize

▸ **serialize**(): `Uint8Array`

Returns the RLP serialization of the account as a `Uint8Array`.

#### Returns

`Uint8Array`

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/account.d.ts:30

___

### fromAccountData

▸ **fromAccountData**(`accountData`): [`EthjsAccount`](utils.EthjsAccount.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `accountData` | `AccountData` |

#### Returns

[`EthjsAccount`](utils.EthjsAccount.md)

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/account.d.ts:14

___

### fromRlpSerializedAccount

▸ **fromRlpSerializedAccount**(`serialized`): [`EthjsAccount`](utils.EthjsAccount.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `serialized` | `Uint8Array` |

#### Returns

[`EthjsAccount`](utils.EthjsAccount.md)

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/account.d.ts:15

___

### fromValuesArray

▸ **fromValuesArray**(`values`): [`EthjsAccount`](utils.EthjsAccount.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `values` | `Uint8Array`[] |

#### Returns

[`EthjsAccount`](utils.EthjsAccount.md)

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+util@9.0.1/node_modules/@ethereumjs/util/dist/esm/account.d.ts:16
