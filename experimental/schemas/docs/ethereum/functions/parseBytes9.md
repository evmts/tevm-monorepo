**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > parseBytes9

# Function: parseBytes9()

> **parseBytes9**\<`TBytes9`\>(`bytes9`): `TBytes9`

Parses a Bytes9 and returns the value if no errors.

## Type parameters

▪ **TBytes9** extends \`0x${string}\`

## Parameters

▪ **bytes9**: `TBytes9`

## Returns

## Example

```ts
import { parseBytes9 } from '@tevm/schemas';
const parsedBytes9 = parseBytes9('0xffaabbccddeeffaabbcc');
```

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:173](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L173)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
