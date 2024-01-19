**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > parseBytes20

# Function: parseBytes20()

> **parseBytes20**\<`TBytes20`\>(`bytes20`): `TBytes20`

Parses a Bytes20 and returns the value if no errors.

## Type parameters

▪ **TBytes20** extends \`0x${string}\`

## Parameters

▪ **bytes20**: `TBytes20`

## Returns

## Example

```ts
import { parseBytes20 } from '@tevm/schemas';
const parsedBytes20 = parseBytes20('0xffaabbccddeeffaabbccddaaeeffaaeeffbbccdd');
```

## Source

[packages/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:337](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L337)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
