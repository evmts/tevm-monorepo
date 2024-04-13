**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > parseBytes18

# Function: parseBytes18()

> **parseBytes18**\<`TBytes18`\>(`bytes18`): `TBytes18`

Parses a Bytes18 and returns the value if no errors.

## Type parameters

▪ **TBytes18** extends \`0x${string}\`

## Parameters

▪ **bytes18**: `TBytes18`

## Returns

## Example

```ts
import { parseBytes18 } from '@tevm/schemas';
const parsedBytes18 = parseBytes18('0xffaabbccddeeffaabbccddaaeeffaaeeffbb');
```

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:307](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L307)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
