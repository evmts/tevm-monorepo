**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > parseBytes3

# Function: parseBytes3()

> **parseBytes3**\<`TBytes3`\>(`bytes3`): `TBytes3`

Parses a Bytes3 and returns the value if no errors.

## Type parameters

▪ **TBytes3** extends \`0x${string}\`

## Parameters

▪ **bytes3**: `TBytes3`

## Returns

## Example

```ts
import { parseBytes3 } from '@tevm/schemas';
const parsedBytes3 = parseBytes3('0xffaabb');
```

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:84](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L84)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
