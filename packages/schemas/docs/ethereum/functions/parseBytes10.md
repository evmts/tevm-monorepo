**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > parseBytes10

# Function: parseBytes10()

> **parseBytes10**\<`TBytes10`\>(`bytes10`): `TBytes10`

Parses a Bytes10 and returns the value if no errors.

## Type parameters

▪ **TBytes10** extends \`0x${string}\`

## Parameters

▪ **bytes10**: `TBytes10`

## Returns

## Example

```ts
import { parseBytes10 } from '@tevm/schemas';
const parsedBytes = parseBytes10('0xffaabbccddeeffaabbccdd');

## Source

[packages/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:187](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L187)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
