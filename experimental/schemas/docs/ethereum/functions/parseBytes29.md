**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > parseBytes29

# Function: parseBytes29()

> **parseBytes29**\<`TBytes29`\>(`bytes29`): `TBytes29`

Parses a Bytes29 and returns the value if no errors.

## Type parameters

▪ **TBytes29** extends \`0x${string}\`

## Parameters

▪ **bytes29**: `TBytes29`

## Returns

## Example

```ts
import { parseBytes29 } from '@tevm/schemas';
const parsedBytes29 = parseBytes29('0xffaabbccddeeffaabbccddaaeeffaaeeffbbccddccbbddbbccaa');
```

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:471](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L471)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
