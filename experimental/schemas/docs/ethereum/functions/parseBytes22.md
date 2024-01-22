**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > parseBytes22

# Function: parseBytes22()

> **parseBytes22**\<`TBytes22`\>(`bytes22`): `TBytes22`

Parses a Bytes22 and returns the value if no errors.

## Type parameters

▪ **TBytes22** extends \`0x${string}\`

## Parameters

▪ **bytes22**: `TBytes22`

## Returns

## Example

```ts
import { parseBytes22 } from '@tevm/schemas';
const parsedBytes22 = parseBytes22('0xffaabbccddeeffaabbccddaaeeffaaeeffbbccddbb');
```

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:367](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L367)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
