**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > parseBytes21

# Function: parseBytes21()

> **parseBytes21**\<`TBytes21`\>(`bytes21`): `TBytes21`

Parses a Bytes21 and returns the value if no errors.

## Type parameters

▪ **TBytes21** extends \`0x${string}\`

## Parameters

▪ **bytes21**: `TBytes21`

## Returns

## Example

```ts
import { parseBytes21 } from '@tevm/schemas';
const parsedBytes21 = parseBytes21('0xffaabbccddeeffaabbccddaaeeffaaeeffbbccddaa');
```

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:352](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L352)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
