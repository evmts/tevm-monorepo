[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [tevm](../README.md) / parseAddressBook

# Function: parseAddressBook()

> **parseAddressBook**\<`TAddressBook`\>(`addressBook`): `TAddressBook`

Parses an address book and returns the value if no errors.

## Type Parameters

• **TAddressBook** *extends* [`types`](../../types/README.md)

## Parameters

• **addressBook**: `TAddressBook`

## Returns

`TAddressBook`

## Example

```typescript
import {parseAddressBook} from '@tevm/schemas'
const parsedAddressBook = parseAddressBook({
  MyContract: {
    blockCreated: 0,
    address: '0x1234567890abcdef1234567890abcdef12345678'
  }
})
```

## Defined in

[experimental/schemas/src/tevm/SAddressBook.js:121](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/tevm/SAddressBook.js#L121)
