[@tevm/schemas](../README.md) / [Modules](../modules.md) / tevm

# Module: tevm

## Table of contents

### References

- [IsAddressBook](tevm.md#isaddressbook)

### Classes

- [InvalidAddressBookError](../classes/tevm.InvalidAddressBookError.md)

### Interfaces

- [AddressBookEntry](../interfaces/tevm.AddressBookEntry.md)

### Type Aliases

- [AddressBook](tevm.md#addressbook)

### Variables

- [SAddressBook](tevm.md#saddressbook)

### Functions

- [isAddressBook](tevm.md#isaddressbook-1)
- [parseAddressBook](tevm.md#parseaddressbook)
- [parseAddressBookSafe](tevm.md#parseaddressbooksafe)

## References

### IsAddressBook

Re-exports [IsAddressBook](types.md#isaddressbook)

## Type Aliases

### AddressBook

Ƭ **AddressBook**\<\>: [`types`](types.md)

#### Defined in

[evmts-monorepo/experimental/schemas/src/tevm/SAddressBook.js:26](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/tevm/SAddressBook.js#L26)

## Variables

### SAddressBook

• `Const` **SAddressBook**: `Schema`\<[`types`](types.md), [`types`](types.md)\>

[Effect schema](https://github.com/Effect-TS/schema) for the AddressBook type.

#### Defined in

[evmts-monorepo/experimental/schemas/src/tevm/SAddressBook.js:46](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/tevm/SAddressBook.js#L46)

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

[evmts-monorepo/experimental/schemas/src/tevm/SAddressBook.js:38](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/tevm/SAddressBook.js#L38)

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
import {parseAddressBook} from '@tevm/schemas'
const parsedAddressBook = parseAddressBook({
  MyContract: {
    blockCreated: 0,
    address: '0x1234567890abcdef1234567890abcdef12345678'
  }
})
```

#### Defined in

[evmts-monorepo/experimental/schemas/src/tevm/SAddressBook.js:121](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/tevm/SAddressBook.js#L121)

___

### parseAddressBookSafe

▸ **parseAddressBookSafe**\<`TAddressBook`\>(`addressBook`): `Effect`\<`never`, [`InvalidAddressBookError`](../classes/tevm.InvalidAddressBookError.md), `TAddressBook`\>

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

`Effect`\<`never`, [`InvalidAddressBookError`](../classes/tevm.InvalidAddressBookError.md), `TAddressBook`\>

**`Example`**

```typescript
import {parseAddressBookSafe} from '@tevm/schemas'
const parsedAddressBookEffect = parseAddressBookSafe({
  MyContract: {
    blockCreated: 0,
    address: '0x1234567890abcdef1234567890abcdef12345678'
  }
})
```

#### Defined in

[evmts-monorepo/experimental/schemas/src/tevm/SAddressBook.js:90](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/tevm/SAddressBook.js#L90)
