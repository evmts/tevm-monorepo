**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > parseBytes28

# Function: parseBytes28()

> **parseBytes28**\<`TBytes28`\>(`bytes28`): `TBytes28`

Parses a Bytes28 and returns the value if no errors.

## Type parameters

▪ **TBytes28** extends \`0x${string}\`

## Parameters

▪ **bytes28**: `TBytes28`

## Returns

## Example

```ts
import { parseBytes28 } from '@tevm/schemas';
const parsedBytes28 = parseBytes28('0xffaabbccddeeffaabbccddaaeeffaaeeffbbccddccbbddbbcc');
```

## Source

[packages/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:456](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L456)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
