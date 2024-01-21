**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > parseBytes27

# Function: parseBytes27()

> **parseBytes27**\<`TBytes27`\>(`bytes27`): `TBytes27`

Parses a Bytes27 and returns the value if no errors.

## Type parameters

▪ **TBytes27** extends \`0x${string}\`

## Parameters

▪ **bytes27**: `TBytes27`

## Returns

## Example

```ts
import { parseBytes27 } from '@tevm/schemas';
const parsedBytes27 = parseBytes27('0xffaabbccddeeffaabbccddaaeeffaaeeffbbccddccbbddbb');
```

## Source

[packages/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:442](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L442)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
