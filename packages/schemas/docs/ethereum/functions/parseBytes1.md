**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > parseBytes1

# Function: parseBytes1()

> **parseBytes1**\<`TBytes1`\>(`bytes1`): `TBytes1`

Parses a Bytes1 and returns the value if no errors.

## Type parameters

▪ **TBytes1** extends \`0x${string}\`

## Parameters

▪ **bytes1**: `TBytes1`

## Returns

## Example

```ts
import { parseBytes1 } from '@tevm/schemas';
const parsedBytes1 = parseBytes1('0xff');
```

## Source

[packages/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:54](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L54)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
