**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [tevm](../README.md) > parseAddressBookSafe

# Function: parseAddressBookSafe()

> **parseAddressBookSafe**\<`TAddressBook`\>(`addressBook`): `Effect`\<`never`, [`InvalidAddressBookError`](../classes/InvalidAddressBookError.md), `TAddressBook`\>

Safely parses an address book into an [Effect](https://www.effect.website/docs/essentials/effect-type).

## Type parameters

▪ **TAddressBook** extends [`types`](../../types/README.md)

## Parameters

▪ **addressBook**: `TAddressBook`

## Returns

## Example

```typescript
import {parseAddressBookSafe} from '@tevm/schemas'
const parsedAddressBookEffect = parseAddressBookSafe({
  MyContract: {
    blockCreated: 0,
    address: '0x1234567890abcdef1234567890abcdef12345678'
  }
})
```

## Source

[packages/schemas/src/tevm/SAddressBook.js:90](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/tevm/SAddressBook.js#L90)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
