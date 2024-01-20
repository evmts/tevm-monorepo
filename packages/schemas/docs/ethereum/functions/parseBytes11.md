**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > parseBytes11

# Function: parseBytes11()

> **parseBytes11**\<`TBytes11`\>(`bytes11`): `TBytes11`

Parses a Bytes11 and returns the value if no errors.

## Type parameters

▪ **TBytes11** extends \`0x${string}\`

## Parameters

▪ **bytes11**: `TBytes11`

## Returns

## Example

```ts
import { parseBytes11 } from '@tevm/schemas';
const parsedBytes11 = parseBytes11('0xffaabbccddeeffaabbccddaa');
```

## Source

[packages/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:202](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L202)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
