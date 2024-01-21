**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > parseBytes32

# Function: parseBytes32()

> **parseBytes32**\<`TBytes32`\>(`bytes32`): `TBytes32`

Parses a Bytes32 and returns the value if no errors.

## Type parameters

▪ **TBytes32** extends \`0x${string}\`

## Parameters

▪ **bytes32**: `TBytes32`

## Returns

## Example

```ts
import { parseBytes32 } from '@tevm/schemas';
const parsedBytes32 = parseBytes32('0xffaabbccddeeffaabbccddaaeeffaaeeffbbccddccbbddbbccaaaaaabb');
```

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:516](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L516)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
