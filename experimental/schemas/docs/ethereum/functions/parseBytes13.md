**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > parseBytes13

# Function: parseBytes13()

> **parseBytes13**\<`TBytes13`\>(`bytes13`): `TBytes13`

Parses a Bytes13 and returns the value if no errors.

## Type parameters

▪ **TBytes13** extends \`0x${string}\`

## Parameters

▪ **bytes13**: `TBytes13`

## Returns

## Example

```ts
import { parseBytes13 } from '@tevm/schemas';
const parsedBytes13 = parseBytes13('0xffaabbccddeeffaabbccddaaeeff');
```

## Source

[packages/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:232](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L232)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
