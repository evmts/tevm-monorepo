**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > parseBytes7

# Function: parseBytes7()

> **parseBytes7**\<`TBytes7`\>(`bytes7`): `TBytes7`

Parses a Bytes7 and returns the value if no errors.

## Type parameters

▪ **TBytes7** extends \`0x${string}\`

## Parameters

▪ **bytes7**: `TBytes7`

## Returns

## Example

```ts
import { parseBytes7 } from '@tevm/schemas';
const parsedBytes7 = parseBytes7('0xffaabbccddeeffaa');
```

## Source

[packages/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:143](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L143)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
