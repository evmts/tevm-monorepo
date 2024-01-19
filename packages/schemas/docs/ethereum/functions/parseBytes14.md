**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > parseBytes14

# Function: parseBytes14()

> **parseBytes14**\<`TBytes14`\>(`bytes14`): `TBytes14`

Parses a Bytes14 and returns the value if no errors.

## Type parameters

▪ **TBytes14** extends \`0x${string}\`

## Parameters

▪ **bytes14**: `TBytes14`

## Returns

## Example

```ts
import { parseBytes14 } from '@tevm/schemas';
const parsedBytes14 = parseBytes14('0xffaabbccddeeffaabbccddaaeeffaa');
```

## Source

[packages/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:247](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L247)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
