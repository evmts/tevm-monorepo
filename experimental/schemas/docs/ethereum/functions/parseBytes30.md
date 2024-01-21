**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > parseBytes30

# Function: parseBytes30()

> **parseBytes30**\<`TBytes30`\>(`bytes30`): `TBytes30`

Parses a Bytes30 and returns the value if no errors.

## Type parameters

▪ **TBytes30** extends \`0x${string}\`

## Parameters

▪ **bytes30**: `TBytes30`

## Returns

## Example

```ts
import { parseBytes30 } from '@tevm/schemas';
const parsedBytes30 = parseBytes30('0xffaabbccddeeffaabbccddaaeeffaaeeffbbccddccbbddbbccaaaa');
```

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:486](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L486)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
