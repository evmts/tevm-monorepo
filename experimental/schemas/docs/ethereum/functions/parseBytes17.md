**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > parseBytes17

# Function: parseBytes17()

> **parseBytes17**\<`TBytes17`\>(`bytes17`): `TBytes17`

Parses a Bytes17 and returns the value if no errors.

## Type parameters

▪ **TBytes17** extends \`0x${string}\`

## Parameters

▪ **bytes17**: `TBytes17`

## Returns

## Example

```ts
import { parseBytes17 } from '@tevm/schemas';
const parsedBytes17 = parseBytes17('0xffaabbccddeeffaabbccddaaeeffaaeeffaa');
```

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:292](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L292)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
