**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > parseBytes8

# Function: parseBytes8()

> **parseBytes8**\<`TBytes8`\>(`bytes8`): `TBytes8`

Parses a Bytes8 and returns the value if no errors.

## Type parameters

▪ **TBytes8** extends \`0x${string}\`

## Parameters

▪ **bytes8**: `TBytes8`

## Returns

## Example

```ts
import { parseBytes8 } from '@tevm/schemas';
const parsedBytes8 = parseBytes8('0xffaabbccddeeffaabb');
```

## Source

[packages/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:158](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L158)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
