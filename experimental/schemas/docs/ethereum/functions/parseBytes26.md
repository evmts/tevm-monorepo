**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > parseBytes26

# Function: parseBytes26()

> **parseBytes26**\<`TBytes26`\>(`bytes26`): `TBytes26`

Parses a Bytes26 and returns the value if no errors.

## Type parameters

▪ **TBytes26** extends \`0x${string}\`

## Parameters

▪ **bytes26**: `TBytes26`

## Returns

## Example

```ts
import { parseBytes26 } from '@tevm/schemas';
const parsedBytes26 = parseBytes26('0xffaabbccddeeffaabbccddaaeeffaaeeffbbccddccbbddaa');
```

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:427](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L427)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
