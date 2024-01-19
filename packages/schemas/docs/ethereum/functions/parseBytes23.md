**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > parseBytes23

# Function: parseBytes23()

> **parseBytes23**\<`TBytes23`\>(`bytes23`): `TBytes23`

Parses a Bytes23 and returns the value if no errors.

## Type parameters

▪ **TBytes23** extends \`0x${string}\`

## Parameters

▪ **bytes23**: `TBytes23`

## Returns

## Example

```ts
import { parseBytes23 } from '@tevm/schemas';
const parsedBytes23 = parseBytes23('0xffaabbccddeeffaabbccddaaeeffaaeeffbbccddcc');
```

## Source

[packages/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:382](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L382)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
