[@evmts/schemas](../README.md) / [Modules](../modules.md) / evmts

# Module: evmts

## Table of contents

### References

- [IsAddressBook](evmts.md#isaddressbook)

### Classes

- [InvalidAddressBookError](../classes/evmts.InvalidAddressBookError.md)

### Interfaces

- [AddressBookEntry](../interfaces/evmts.AddressBookEntry.md)

### Type Aliases

- [AddressBook](evmts.md#addressbook)

### Variables

- [SAddressBook](evmts.md#saddressbook)

### Functions

- [isAddressBook](evmts.md#isaddressbook-1)
- [parseAddressBook](evmts.md#parseaddressbook)
- [parseAddressBookSafe](evmts.md#parseaddressbooksafe)

## References

### IsAddressBook

Re-exports [IsAddressBook](types.md#isaddressbook)

## Type Aliases

### AddressBook

Ƭ **AddressBook**\<\>: [`types`](types.md)

#### Defined in

[packages/schemas/src/evmts/SAddressBook.js:26](https://github.com/evmts/evmts-monorepo/blob/main/packages/schemas/src/evmts/SAddressBook.js#L26)

## Variables

### SAddressBook

• `Const` **SAddressBook**: `Schema`\<[`types`](types.md), [`types`](types.md)\>

[Effect schema](https://github.com/Effect-TS/schema) for the AddressBook type.

#### Defined in

[packages/schemas/src/evmts/SAddressBook.js:46](https://github.com/evmts/evmts-monorepo/blob/main/packages/schemas/src/evmts/SAddressBook.js#L46)

## Functions

### isAddressBook

▸ **isAddressBook**\<`TContractNames`\>(`addressBook`): addressBook is AddressBook\<TContractNames\>

Type guard that returns true if an address book is a valid address

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TContractNames` | extends `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `addressBook` | `unknown` |

#### Returns

addressBook is AddressBook\<TContractNames\>

#### Defined in

[packages/schemas/src/types.d.ts:27](https://github.com/evmts/evmts-monorepo/blob/main/packages/schemas/src/types.d.ts#L27)

___

### parseAddressBook

▸ **parseAddressBook**\<`TAddressBook`\>(`addressBook`): `TAddressBook`

Parses an address book and returns the value if no errors.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAddressBook` | extends [`types`](types.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `addressBook` | `TAddressBook` |

#### Returns

`TAddressBook`

**`Example`**

```typescript
import {parseAddressBook} from '@evmts/schemas'
const parsedAddressBook = parseAddressBook({
  MyContract: {
    blockCreated: 0,
    address: '0x1234567890abcdef1234567890abcdef12345678'
  }
})
```

#### Defined in

[packages/schemas/src/evmts/SAddressBook.js:121](https://github.com/evmts/evmts-monorepo/blob/main/packages/schemas/src/evmts/SAddressBook.js#L121)

___

### parseAddressBookSafe

▸ **parseAddressBookSafe**\<`TAddressBook`\>(`addressBook`): `Effect`\<`never`, [`InvalidAddressBookError`](../classes/evmts.InvalidAddressBookError.md), `TAddressBook`\>

Safely parses an address book into an [Effect](https://www.effect.website/docs/essentials/effect-type).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAddressBook` | extends [`types`](types.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `addressBook` | `TAddressBook` |

#### Returns

`Effect`\<`never`, [`InvalidAddressBookError`](../classes/evmts.InvalidAddressBookError.md), `TAddressBook`\>

**`Example`**

```typescript
import {parseAddressBookSafe} from '@evmts/schemas'
const parsedAddressBookEffect = parseAddressBookSafe({
  MyContract: {
    blockCreated: 0,
    address: '0x1234567890abcdef1234567890abcdef12345678'
  }
})
```

#### Defined in

[packages/schemas/src/evmts/SAddressBook.js:90](https://github.com/evmts/evmts-monorepo/blob/main/packages/schemas/src/evmts/SAddressBook.js#L90)
