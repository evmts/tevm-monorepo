**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > parseBytes12

# Function: parseBytes12()

> **parseBytes12**\<`TBytes12`\>(`bytes12`): `TBytes12`

Parses a Bytes12 and returns the value if no errors.

## Type parameters

▪ **TBytes12** extends \`0x${string}\`

## Parameters

▪ **bytes12**: `TBytes12`

## Returns

## Example

```ts
import { parseBytes12 } from '@tevm/schemas';
const parsedBytes12 = parseBytes12('0xffaabbccddeeffaabbccddaaee');
```

## Source

[packages/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:217](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L217)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
