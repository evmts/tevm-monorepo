[@evmts/schemas](/reference/schemas/README.md) / [Modules](/reference/schemas/modules.md) / types

# Module: types

## Table of contents

### Type Aliases

- [AddressBook](/reference/schemas/modules/types.md#addressbook)
- [AddressBookEntry](/reference/schemas/modules/types.md#addressbookentry)
- [BlockNumber](/reference/schemas/modules/types.md#blocknumber)
- [IsAddressBook](/reference/schemas/modules/types.md#isaddressbook)
- [IsBlockNumber](/reference/schemas/modules/types.md#isblocknumber)

## Type Aliases

### AddressBook

Ƭ **AddressBook**<`TContractNames`\>: { readonly [contractName in TContractNames]: AddressBookEntry }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TContractNames` | extends `string` |

#### Defined in

[schemas/src/types.d.ts:23](https://github.com/evmts/evmts-monorepo/blob/main/schemas/src/types.d.ts#L23)

___

### AddressBookEntry

Ƭ **AddressBookEntry**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `blockCreated` | `number` |

#### Defined in

[schemas/src/types.d.ts:18](https://github.com/evmts/evmts-monorepo/blob/main/schemas/src/types.d.ts#L18)

___

### BlockNumber

Ƭ **BlockNumber**: `number`

#### Defined in

[schemas/src/types.d.ts:3](https://github.com/evmts/evmts-monorepo/blob/main/schemas/src/types.d.ts#L3)

___

### IsAddressBook

Ƭ **IsAddressBook**: <TContractNames\>(`addressBook`: `unknown`) => addressBook is AddressBook<TContractNames\>

#### Type declaration

▸ <`TContractNames`\>(`addressBook`): addressBook is AddressBook<TContractNames\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TContractNames` | extends `string` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `addressBook` | `unknown` |

##### Returns

addressBook is AddressBook<TContractNames\>

#### Defined in

[schemas/src/types.d.ts:27](https://github.com/evmts/evmts-monorepo/blob/main/schemas/src/types.d.ts#L27)

___

### IsBlockNumber

Ƭ **IsBlockNumber**: (`blockNumber`: `unknown`) => blockNumber is BlockNumber

#### Type declaration

▸ (`blockNumber`): blockNumber is BlockNumber

Returns a boolean indicating whether the provided number is a valid ethereum blocknumber

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockNumber` | `unknown` | The blocknumber to check |

##### Returns

blockNumber is BlockNumber

A boolean indicating whether the provided number is a valid ethereum blocknumber

**`Example`**

```ts
isBlockNumber(0) // true
isBlockNumber(1) // true
isBlockNumber(100) // true
isBlockNumber(-1) // false
isBlockNumber(1.1) // false
```

#### Defined in

[schemas/src/types.d.ts:16](https://github.com/evmts/evmts-monorepo/blob/main/schemas/src/types.d.ts#L16)
