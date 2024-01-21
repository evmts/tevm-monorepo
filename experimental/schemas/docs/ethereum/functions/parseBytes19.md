**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > parseBytes19

# Function: parseBytes19()

> **parseBytes19**\<`TBytes19`\>(`bytes19`): `TBytes19`

Parses a Bytes19 and returns the value if no errors.

## Type parameters

▪ **TBytes19** extends \`0x${string}\`

## Parameters

▪ **bytes19**: `TBytes19`

## Returns

## Example

```ts
import { parseBytes19 } from '@tevm/schemas';
const parsedBytes19 = parseBytes19('0xffaabbccddeeffaabbccddaaeeffaaeeffbbcc');
```

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:322](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L322)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
